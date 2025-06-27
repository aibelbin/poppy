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

    


@app.post("/sendEvent/")

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

    event = {
        'summary': name,
        'location': location,
        'description': description,
        'start': {
            'dateTime': start_time.isoformat(),
            'timeZone': 'Asia/Kolkata',
        },
        'end': {
            'dateTime': (datetime.now() + timedelta(hours=3)).isoformat(),
            'timeZone': 'Asia/Kolkata',
        },
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'popup', 'minutes': 30},
                {'method': 'popup', 'minutes': 10},
               # {'email'}
            ],
        },
    }

    created_event = service.events().insert(calendarId='primary', body=event).execute()
    print(" Event created:")
    print(created_event.get('htmlLink'))


async def postRequest(report: ReportRequest):
     description =  report.description
     name = report.name
     start_time = report.start_time
     location = report.location

     add_calendar_event(description= description, name=name, start_time=start_time, location=location)
