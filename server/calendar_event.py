from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from datetime import datetime, timedelta
import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import pickle




SCOPES = ['https://www.googleapis.com/auth/calendar.events']

app = FastAPI()

class ReportRequest(BaseModel):
    name : str
    location : str
    description : str
    start_time : str


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

@app.post("/sendEvent/")
async def send_event(report: ReportRequest):
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


