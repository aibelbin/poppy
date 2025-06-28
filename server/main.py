from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import boto3
from botocore.client import Config
from uuid import uuid4
from supabase import create_client, Client
import io 
import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from datetime import datetime, timedelta

from reportGen import genPdf


# import requests

# def get_travel_time(origin, destination, api_key):
#     url = "https://maps.googleapis.com/maps/api/distancematrix/json"
#     params = {
#         "origins": origin,                                                                ditching as I ran out of credits 
#         "destinations": destination,
#         "mode": "driving",
#         "key": #ran out 
#     }
#     response = requests.get(url, params=params).json()
#     seconds = response['rows'][0]['elements'][0]['duration']['value']
#     return seconds // 60  

SCOPES = ['https://www.googleapis.com/auth/calendar.events']

app = FastAPI()

public_url = "https://pub-1fd21d97a2784464bc390df565566603.r2.dev" #move to env
  
s3 = boto3.client(
    service_name ="s3",
    endpoint_url = "https://04114997135d9ee653270d71503b646e.r2.cloudflarestorage.com/poppy",
    aws_access_key_id = 'ba7365e14077d2a311400c15dded5ecf',
    aws_secret_access_key = '5496ea7f61b760523daff22f4c504ea659402a5d4046a1b6e9019d9cf47dec26',
    region_name="auto",
)

url_supabase: str = "https://qraowymnwpmvpgdgzsjk.supabase.co/"
key_supabase: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyYW93eW1ud3BtdnBnZGd6c2prIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTAwMjg1OCwiZXhwIjoyMDY2NTc4ODU4fQ.1pWiSLt_ulL8emi3iONIVVkvSZMCz3f7GKj1y1Yw6Mk"

supabase: Client = create_client(url_supabase, key_supabase)


class generateReport(BaseModel):
    recievedReport : str
    doctorid : str
    patientid : str
    symptoms : str
    priority : str

class sendEvent(BaseModel):
    description : str
    name : str
    start_time : str
    location : str


def get_calendar_service():
    creds = None

    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

    if not creds:
        flow = InstalledAppFlow.from_client_secrets_file(
            'credentials.json', SCOPES
        )

        
        creds = flow.run_local_server(port=3000)

        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return build('calendar', 'v3', credentials=creds)

def add_calendar_event(description, name, start_time, location):
    service = get_calendar_service()

    start_dt = datetime.fromisoformat(start_time)
    end_dt = start_dt + timedelta(hours=2)

    event = {
        'summary': name,
        'location': location,
        'description': description,
        'start': {
            'dateTime': start_dt.isoformat(),
            'timeZone': 'Asia/Kolkata',
        },
        'end': {
            'dateTime': end_dt.isoformat(),
            'timeZone': 'Asia/Kolkata',
        },
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'popup', 'minutes': 30},
                {'method': 'popup', 'minutes': 10},
                {'method' : 'email', 'minutes': 30},
            ],
        },
    }

    created_event = service.events().insert(calendarId='primary', body=event).execute()
    print(" Event created:")
    print(created_event.get('htmlLink'))

@app.post("/send-event/")
async def send_event(report: sendEvent):
    try:
        link = add_calendar_event(
            description=report.description,
            name=report.name,
            start_time=report.start_time,
            location=report.location
        )
        return {"message": "Event created successfully", "link": link}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create calendar event.")


@app.post("/generate-report/")

async def generatePdf(request: generateReport):
    try: 
        key = str(uuid4()) 
        pdf_geneerated = genPdf(request.recievedReport, key + ".pdf")
        doctorid = request.doctorid
        patientid = request.patientid
        priority = request.priority
        symptoms = request.symptoms 

        s3.upload_fileobj(io.BytesIO(open(key + ".pdf", "rb").read()),"poppy", key)
        object_details = s3.head_object(Bucket = "poppy", Key = key)

        print(object_details)

        os.remove(key + ".pdf")

        try: 
            insert_status = supabase.table('reports') \
                .insert({"url": "https://pub-1fd21d97a2784464bc390df565566603.r2.dev"+key , "doctor" : doctorid, "patient" : patientid, "priority": priority, "symptoms" : symptoms}) \
                .execute()
        
        except Exception as error: 
             print(f"An Error has occurred: {error}")

        return {"message": "PDF uploaded successfully", "url": object_details }
    




    except Exception as e: 
        print(f"Error{e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while generating the PDF."
        )

   
    