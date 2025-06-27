from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from datetime import datetime, timedelta
import os
import pickle



SCOPES = ['https://www.googleapis.com/auth/calendar.events']

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


def add_calendar_event():
    service = get_calendar_service()

    event = {
        'summary': 'Doctor Appointment',
        'location': 'City Hospital, MG Road, Kochi',
        'description': 'Initial consultation scheduled via AI triage.',
        'start': {
            'dateTime': (datetime.now() + timedelta(hours=2)).isoformat(),
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
            ],
        },
    }

    created_event = service.events().insert(calendarId='primary', body=event).execute()
    print(" Event created:")
    print(created_event.get('htmlLink'))


if __name__ == '__main__':
    add_calendar_event()
