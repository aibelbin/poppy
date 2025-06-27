"use server";

import { db } from "@/db";
import { patients, doctors } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
export const login = async (email: string, password: string) => {
    let result;
    if (email.endsWith("poppy.ai")) {
        result = await db.select().from(doctors).where(eq(doctors.email, email)).then(results => results);
        if (!result || result.length === 0 || result[0].password !== password) {
            throw new Error("Invalid email or password");
        }
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY environment variable is not set");
        }
        console.log(result[0]);
        const token = jwt.sign({ id: result[0].id ,type: "doctor"}, process.env.SECRET_KEY, { expiresIn: "1h" });
        return { success: true, token, type: "doctor" };
    } else {
        result = await db.select().from(patients).where(eq(patients.email, email)).then(results => results);
     
    }
    console.log(result);
    if (!result || result.length === 0 || result[0].password !== password) {
        throw new Error("Invalid email or password");
    }

    if (!process.env.SECRET_KEY) {
        throw new Error("SECRET_KEY environment variable is not set");
    }
    const token = jwt.sign({ id: result[0].id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    return { success: true, token, type: "patient" };
}