import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()
# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
account_sid = os.environ["TWILIO_ACCOUNT_SID"]
auth_token = os.environ["TWILIO_AUTH_TOKEN"]
number = os.environ["TWILIO_NUMBER"]
client = Client(account_sid, auth_token)

call = client.calls.create(
    twiml="<Response><Say>Ahoy, World!</Say></Response>",
    to="+918921964557",
    from_=number,
)

print(call.sid)