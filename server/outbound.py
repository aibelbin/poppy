import os
import json
import traceback
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Request, WebSocket, Form, Depends, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from twilio.twiml.voice_response import VoiceResponse, Connect, Stream
from twilio.rest import Client
from elevenlabs import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation, ConversationInitiationData
from twilio_audio_interface import TwilioAudioInterface
from starlette.websockets import WebSocketDisconnect, WebSocketState
from urllib.parse import quote
from supabase import create_client, Client as SupabaseClient

load_dotenv()

dynamic_vars = {}

# Load environment variables
ELEVENLABS_AGENT_ID_POPPY = os.getenv("ELEVENLABS_AGENT_ID_POPPY")
ELEVENLABS_AGENT_ID_MISSDOSS = os.getenv("ELEVENLABS_AGENT_ID_MISSDOSS")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: SupabaseClient = create_client(url, key)

# Check for required environment variables
if not ELEVENLABS_API_KEY or not ELEVENLABS_AGENT_ID_POPPY or not ELEVENLABS_AGENT_ID_MISSDOSS:
    raise ValueError("Missing required ElevenLabs environment variables")

app = FastAPI(title="Twilio-ElevenLabs Integration Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to get Twilio client
def get_twilio_client():
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        raise HTTPException(status_code=500, detail="Twilio credentials not configured")
    return Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

@app.get("/")
async def root():
    return {"message": "Twilio-ElevenLabs Integration Server"}


@app.post("/outbound-call")
async def outbound_call(
    mode: str = Form(...),
    patient_id: str = Form(...),
    request: Request = None,
    twilio_client: Client = Depends(get_twilio_client)
):
    global dynamic_vars
    if not TWILIO_PHONE_NUMBER:
        raise HTTPException(status_code=500, detail="Twilio phone number not configured")
    
    try:
        # Create URL for TwiML with proper URL encoding for parameters
        if (mode == "poppy"):
            twiml_url = f"https://{request.headers.get('host')}/outbound-call-twiml-poppy"
        else:
            twiml_url = f"https://{request.headers.get('host')}/outbound-call-twiml-missdoss"
        
        patient_response = supabase.table('patients').select("*").eq("id", patient_id).execute()
        patient = patient_response.data[0]
        doctor_response = supabase.table('doctors').select("*").eq("id", patient["doctor"]).execute()
        doctor = doctor_response.data[0]
        personalisation_response = supabase.table('personalisation').select("*").eq("user_id", patient["id"]).execute()
        
        # records[patient["id"]] = patient
        # records[doctor["id"]] = doctor
        # personalisation[patient["id"]] = 
        # dynamic_vars[patient["id"]] = {
        #     "doctor": doctor,
        #     "patient": patient,
        #     "personalisation": personalisation_response.data[0]["data"],
        # }
        print("PATIENT:", patient["phone_number"])
        dynamic_vars = {
            "doctorid": doctor["id"],
            "doctor_name": doctor["first_name"] + " " + doctor["last_name"],
            "patientid": patient["id"],
            "patient_name": patient["first_name"] + " " + patient["last_name"],
            "patient_age": patient["age"],
            "patient_gender": patient["gender"],
            "patient_personalisation": personalisation_response.data[0]["data"],
        }

        # Initiate the call via Twilio
        call = twilio_client.calls.create(
            from_=TWILIO_PHONE_NUMBER,
            to=patient["phone_number"],
            url=twiml_url
        )
        
        return JSONResponse({
            "success": True,
            "message": "Call initiated",
            "callSid": call.sid
        })
    except Exception as e:
        print(f"Error initiating outbound call: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Failed to initiate call",
                "details": str(e)
            }
        )

@app.get("/outbound-call-twiml-poppy")
@app.post("/outbound-call-twiml-poppy")
async def outbound_call_twiml_poppy(
    request: Request,
):
    response = VoiceResponse()
    connect = Connect()
    
    # Create a Stream with parameters
    stream = Stream(url=f"wss://{request.headers.get('host')}/outbound-media-stream-poppy",format="pcm16")
    
    connect.append(stream)
    response.append(connect)
    
    return HTMLResponse(content=str(response), media_type="application/xml")

@app.websocket("/outbound-media-stream-poppy")
async def handle_outbound_media_stream_poppy(websocket: WebSocket):
    await websocket.accept()
    print("Outbound WebSocket connection opened")
    
    # Variables to track the call
    stream_sid = None
    call_sid = None
    audio_interface = TwilioAudioInterface(websocket)
    eleven_labs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
    conversation = None
    
    try:
        async for message in websocket.iter_text():
            if not message:
                print("Empty message received")
                continue
                
            # print(f"Raw WebSocket message: {message[:200]}...")
                
            data = json.loads(message)
            event_type = data.get("event")
            
            # Handle the start event
            if event_type == "start":
                stream_sid = data["start"]["streamSid"]
                call_sid = data["start"]["callSid"]
                custom_parameters = data["start"].get("customParameters", {})
                
                # Set stream_sid in audio interface
                audio_interface.stream_sid = stream_sid
                
                
                print(f"Outbound call started - StreamSid: {stream_sid}, CallSid: {call_sid}")

                config = ConversationInitiationData(
                    dynamic_variables=dynamic_vars
                )
                
                # Initialize the conversation
                try:
                    conversation = Conversation(
                        client=eleven_labs_client,
                        agent_id=ELEVENLABS_AGENT_ID_POPPY,
                        requires_auth=True,
                        audio_interface=audio_interface,
                        callback_agent_response=lambda text: print(f"Agent: {text}"),
                        callback_user_transcript=lambda text: print(f"User said: {text}"),
                        config=config
                    )

                    conversation.start_session()
                    print("ElevenLabs conversation started successfully")
                except Exception as e:
                    print(f"Error starting ElevenLabs conversation: {str(e)}")
                    traceback.print_exc()
                
            # Handle incoming media
            elif event_type == "media" and conversation:
                try:
                    await audio_interface.handle_twilio_message(data)
                except Exception as e:
                    print(f"Error handling audio: {str(e)}")
                    traceback.print_exc()
            
            # Handle stop event
            elif event_type == "stop":
                print(f"Call ended - StreamSid: {stream_sid}")
                if conversation:
                    try:
                        conversation.end_session()
                        print("ElevenLabs conversation ended")
                    except Exception as e:
                        print(f"Error ending conversation: {str(e)}")
    
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        traceback.print_exc()
        
    finally:
        if conversation:
            try:
                conversation.end_session()
                conversation.wait_for_session_end()
                print("Conversation cleanup completed")
            except Exception as e:
                print(f"Error in conversation cleanup: {str(e)}")


# Miss Doss
@app.get("/outbound-call-twiml-missdoss")
@app.post("/outbound-call-twiml-missdoss")
async def outbound_call_twiml_missdoss(
    request: Request,
):
    response = VoiceResponse()
    connect = Connect()
    
    # Create a Stream with parameters
    stream = Stream(url=f"wss://{request.headers.get('host')}/outbound-media-stream-missdoss",format="pcm16")
    
    connect.append(stream)
    response.append(connect)
    
    return HTMLResponse(content=str(response), media_type="application/xml")

@app.websocket("/outbound-media-stream-missdoss")
async def handle_outbound_media_stream_missdoss(websocket: WebSocket):
    await websocket.accept()
    print("Outbound WebSocket connection opened")
    
    # Variables to track the call
    stream_sid = None
    call_sid = None
    audio_interface = TwilioAudioInterface(websocket)
    eleven_labs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
    conversation = None
    
    try:
        async for message in websocket.iter_text():
            if not message:
                print("Empty message received")
                continue
                
            # print(f"Raw WebSocket message: {message[:200]}...")
                
            data = json.loads(message)
            event_type = data.get("event")
            
            # Handle the start event
            if event_type == "start":
                stream_sid = data["start"]["streamSid"]
                call_sid = data["start"]["callSid"]
                custom_parameters = data["start"].get("customParameters", {})
                
                # Set stream_sid in audio interface
                audio_interface.stream_sid = stream_sid
                
                
                print(f"Outbound call started - StreamSid: {stream_sid}, CallSid: {call_sid}")
                
                config = ConversationInitiationData(
                    dynamic_variables=dynamic_vars
                )
                # Initialize the conversation
                try:
                    conversation = Conversation(
                        client=eleven_labs_client,
                        agent_id=ELEVENLABS_AGENT_ID_MISSDOSS,
                        requires_auth=True,
                        audio_interface=audio_interface,
                        callback_agent_response=lambda text: print(f"Agent: {text}"),
                        callback_user_transcript=lambda text: print(f"User said: {text}"),
                        config=config
                    )

                    conversation.start_session()
                    print("ElevenLabs conversation started successfully")
                except Exception as e:
                    print(f"Error starting ElevenLabs conversation: {str(e)}")
                    traceback.print_exc()
                
            # Handle incoming media
            elif event_type == "media" and conversation:
                try:
                    await audio_interface.handle_twilio_message(data)
                except Exception as e:
                    print(f"Error handling audio: {str(e)}")
                    traceback.print_exc()
            
            # Handle stop event
            elif event_type == "stop":
                print(f"Call ended - StreamSid: {stream_sid}")
                if conversation:
                    try:
                        conversation.end_session()
                        print("ElevenLabs conversation ended")
                    except Exception as e:
                        print(f"Error ending conversation: {str(e)}")
    
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        traceback.print_exc()
        
    finally:
        if conversation:
            try:
                conversation.end_session()
                conversation.wait_for_session_end()
                print("Conversation cleanup completed")
            except Exception as e:
                print(f"Error in conversation cleanup: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)