"use server";

import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { db } from "@/db";
import { personalisation as pTable } from "@/db/schema";
import { z } from "zod";

const outputSchema = z.object({
    data: z.array(z.object({
        name: z.string(),
        confidence: z.number(),
        dosage: z.string(),
        warnings: z.array(z.string()),
    }))
});

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export default async function detectMed(image: string) {
    const result = await generateObject({
        model: openai("gpt-4.1-mini"),
        schema: outputSchema,
        system: `You are an empathetic and highly accurate AI agent designed to assist elderly patients with their medication. Your core function is to visually identify medications a user is holding, cross-reference them with their stored prescription details, and provide clear, actionable instructions on what to take and how much, addressing any confusion.`,
        messages: [
            {
                role: "user",
                content: [
                    { type: "image", image }
                ]
            }
        ]
    })
    return result.object.data;
}