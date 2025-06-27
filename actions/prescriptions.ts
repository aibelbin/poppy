"use server";

import { db } from "@/db";
import { sql, eq } from "drizzle-orm";
import { prescriptions } from "@/db/schema";

interface PrescriptionData {
    patient: string;
    course: string;
    timing: Record<string, number>;
    stock: string;
}
export const getPrescriptions = async (id: string) => {
    try {
        const result = await db.select()
            .from(prescriptions)
            .where(eq(prescriptions.patient, id))
            .then(results => results);
        return result;
    } catch (error) {
        console.error("Error fetching prescriptions:", error);
        throw new Error("Failed to fetch prescriptions");
    }
}
export const addPrescriptions = async (data: PrescriptionData) => {
    try {
        const result = await db.insert(prescriptions).values({
            patient: data.patient,
            course: data.course,
            timing: data.timing,
            stock: data.stock,
        });
        return result;
    } catch (error) {
        console.error("Error adding prescriptions:", error);
        throw new Error("Failed to add prescriptions");
    }
}

export const reduceStock = async (id: number) => {
    try{
        const result = await db
            .update(prescriptions)
            .set({ stock: sql`${prescriptions.stock} - 1` })
            .where(eq(prescriptions.id, id))
            .execute();
        return result;
    } catch (error) {
        console.error("Error reducing stock:", error);
        throw new Error("Failed to reduce stock");
    }
}