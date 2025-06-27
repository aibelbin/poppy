"use server";

import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { db } from "@/db";
import { personalisation as pTable } from "@/db/schema";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
})

export default async function addPersonalisation(user: Record<string, string>, data: Record<string, string>) {
    console.log(user);
    console.log(data);
    const result = await generateText({
        model: google("gemini-2.5-flash-preview-04-17"),
        system: `You are an AI assistant tasked with transforming raw patient registration data into a concise, natural-language memory summary. Your goal is to process the provided JSON input (which contains answers to pre-programmed registration questions) and generate a 3-4 sentence system prompt. This output will serve as a foundational context for a separate conversational AI agent, enabling it to engage with the patient in a personalized, informed, and empathetic manner.

Extract the following key information from the JSON:
- Patient's full name and age.
- Primary health conditions/diagnoses (chronic illnesses, heart conditions, diabetes, high blood pressure).
- Current medications being taken.
- Any known allergies and details of severe reactions.
- History of major surgeries.
- Specific needs or impairments (e.g., vision issues, smoking/alcohol status if relevant to current health, physical activity, sleep patterns).
- Emergency contact relationship (e.g., "her son," "his daughter"). Do NOT include phone numbers or full names of emergency contacts in the output prompt.
- Primary doctor or preferred hospital/clinic if relevant for ongoing care.

Synthesize this information into coherent sentences that flow naturally. Prioritize medical and interaction-relevant details that impact immediate care or conversational context. Do not simply list all answers; create a narrative summary.

Example Input (JSON, representing answers to pre-programmed questions):
{
  "name": "Mr. David Lee",
  "age": 82,
  "gender": "Male",
  "hereditary_conditions": "No",
  "family_medical_history": "Father had heart disease, Mother had diabetes",
  "major_surgeries": "Appendix removed at age 25, knee replacement 10 years ago",
  "chronic_conditions": ["Congestive Heart Failure", "Arthritis"],
  "current_medications_status": "Yes",
  "medications": ["Furosemide", "Warfarin", "Naproxen"],
  "history_of_diabetes": "No",
  "high_blood_pressure": "Yes, managed with medication",
  "heart_conditions": ["Congestive Heart Failure"],
  "allergies": ["Sulfa drugs", "Dust mites"],
  "severe_allergic_reaction": "Yes, to sulfa drugs - rash and swelling",
  "mental_health_conditions": "No",
  "smoking": "No, quit 20 years ago",
  "alcohol_consumption": "Occasionally, social drinking",
  "physical_activity": "Light walking 3-4 times a week",
  "sleep_duration": "Around 6-7 hours",
  "primary_doctor": "Dr. Emily White",
  "preferred_hospital": "City General Hospital",
  "health_insurance": "Yes",
  "vision_issues": true,
  "emergency_contact_name": "Sarah Lee",
  "emergency_contact_relation": "Daughter",
  "emergency_contact_phone": "123-456-7890"
}

Example Output (3-4 Sentence System Prompt for Conversational AI):
This patient is Mr. David Lee, an 82-year-old male with a history of Congestive Heart Failure and Arthritis, who also manages high blood pressure. He takes Furosemide, Warfarin, and Naproxen daily, and has a severe allergy to Sulfa drugs, causing rash and swelling. He quit smoking 20 years ago, engages in light walking, and experiences vision issues. His daughter, Sarah, is his emergency contact, and he prefers City General Hospital for treatment.`,
        prompt: `**Patient Info**
Name: ${user.firstName + " " + user.lastName}
Age: ${user.age}
Gender: ${user.gender}\n\n

**Patient Health Data**
${Object.entries(data).map(([question, answer]) => `${question}: ${answer}`).join("\n")}`,
    });

    console.log(`**Patient Info**
Name: ${user.first_name +  " " + (user.last_name ?? "")}
Age: ${user.age}
Gender: ${user.gender}\n\n

**Patient Health Data**
${Object.entries(data).map(([question, answer]) => `${question}: ${answer}`).join("\n")}`);

    await db.insert(pTable).values({ userId: user.id, data: result.text, questions: data }).execute();
    return true;
}