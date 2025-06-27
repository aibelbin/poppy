"use server";

import { db } from "@/db";
import { patients, doctors } from "@/db/schema";
import { eq } from "drizzle-orm";

export const login = async (email: string, password: string) => {
    let result;
    if (email.endsWith("poppy.ai")) {
        result = await db.select().from(doctors).where(eq(doctors.email, email)).then(results => results);
    } else {
        result = await db.select().from(patients).where(eq(patients.email, email)).then(results => results);
    }
    console.log(result);
    if (!result || result.length === 0 || result[0].password !== password) {
        throw new Error("Invalid email or password");
    }
}