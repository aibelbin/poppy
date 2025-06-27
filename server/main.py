from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import boto3
from botocore.client import Config
from uuid import uuid4
import io 
import os





from reportGen import genPdf

app = FastAPI()

public_url = "https://pub-1fd21d97a2784464bc390df565566603.r2.dev" #move to env

s3 = boto3.client(
    service_name ="s3",
    endpoint_url = "https://04114997135d9ee653270d71503b646e.r2.cloudflarestorage.com/poppy",
    aws_access_key_id = 'ba7365e14077d2a311400c15dded5ecf',
    aws_secret_access_key = '5496ea7f61b760523daff22f4c504ea659402a5d4046a1b6e9019d9cf47dec26',
    region_name="auto",
)


class ReportRequest(BaseModel):
    recievedReport: str

@app.post("/genPdf/")

async def generatePdf(request: ReportRequest):
    try: 
        key = str(uuid4()) 
        pdf_geneerated = genPdf(request.recievedReport, key + ".pdf")

        s3.upload_fileobj(io.BytesIO(open(key + ".pdf", "rb").read()),"poppy", key)
        object_details = s3.head_object(Bucket = "poppy", Key = key)

        print(object_details)

        os.remove(key + ".pdf")

        return {"message": "PDF uploaded successfully", "url": object_details }
    




    except Exception as e: 
        print(f"Error{e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while generating the PDF."
        )

