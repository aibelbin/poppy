import os
import time
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv
import requests
from twilio.rest import Client as TwilioClient

load_dotenv()

triggered_events = {}

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

account_sid = os.environ["TWILIO_SMS_ACCOUNT_SID"]
auth_token = os.environ["TWILIO_SMS_AUTH_TOKEN"]
twilio_number = os.environ["TWILIO_PHONE_NUMBER"]
client = TwilioClient(account_sid, auth_token)

def time_diff_in_minutes(current_hhmm, key_hhmm):
    current_dt = datetime.strptime(current_hhmm, "%H%M")
    key_dt = datetime.strptime(key_hhmm, "%H%M")
    diff = (current_dt - key_dt).total_seconds() / 60
    # Handle midnight wrap-around
    if diff < 0:
        diff += 24 * 60
    return diff

def send_notification(patient_id: str):
    try:
        patient_response = supabase.table('patients').select("*").eq("id", patient_id).execute()
        caretaker_response = supabase.table('patients').select("*").eq("id", patient_id).execute()
        patient = patient_response.data[0]
        caretaker = caretaker_response.data[0]
        client.messages.create(
            body="Why didn't you take your medicine? It's time to take your medicine!",
            from_=twilio_number,
            to=patient.phone_number,
        )
        client.messages.create(
            body="Your parent didn't take your medicine. Please ask them to take medicine as soon as possible. Or else, they will die!!",
            from_=twilio_number,
            to=caretaker.phone_number,
        )
    except Exception as e:
        print(f"Error sending notification: {str(e)}")

def send_call(patient_id: str):
    try:
        response = supabase.table('patients').select("*").eq("id", patient_id).execute()
        patient = response.data[0]
        requests.post("https://workable-epic-goshawk.ngrok-free.app/outbound-call", data={"mode": "missdoss", "number": patient.phone_number})
    except Exception as e:
        print(f"Error sending notification: {str(e)}")

def fetch_rows_with_past_timings(table_name: str) -> list:
    current_time = datetime.now().strftime("%H%M")
    response = supabase.table(table_name).select("*").execute()
    rows = response.data
    filtered_rows = []
    for row in rows:
        timing_data = row.get("timing", {})
        for key in timing_data.keys():
            if key < current_time:
                print(f"Missed: {row['id']}")
                diff = time_diff_in_minutes(current_time, key)
                event_key = (row['id'], key)
                if event_key not in triggered_events:
                    triggered_events[event_key] = {'30': False, '60': False}
                # 30 minutes event
                if 30 <= diff < 31 and not triggered_events[event_key]['30']:
                    send_notification(row["patient"])
                    triggered_events[event_key]['30'] = True
                # 1 hour event
                if 60 <= diff < 61 and not triggered_events[event_key]['60']:
                    send_call(row, key)
                    triggered_events[event_key]['60'] = True
    return filtered_rows

while True:
    fetch_rows_with_past_timings("prescriptions")
    print("Polling...")
    time.sleep(10)