"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { appointments, patients } from "@/db/schema";

interface PatientFormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    age: string,
    gender: string;
    email: string;
    password: string;
}

export const addPatient = async (formData: PatientFormData) => {
    try{
    const result = await db.insert(patients).values({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        age: formData.age,
        gender: formData.gender,
        email: formData.email,
        password: formData.password,
    });
    return result;
    } catch (error) {
        console.error("Error adding doctor:", error);
        throw new Error("Failed to add doctor");
    }
}

export const getPatient = async (id: string) => {
    try {
        const result = await db.select()
            .from(patients)
            .where(eq(patients.id, id))
            .then(results => results);
        return result[0];
    } catch (error) {
        console.error("Error fetching patient:", error);
        throw new Error("Failed to fetch patient");
    }
}

export const getDoctor = async (id: string) => {
    try {
        const result = await db.select()
            .from(patients)
            .where(eq(patients.doctor, id))
            .then(results => results);
        return result;
    } catch (error) {
        console.error("Error fetching doctor:", error);
        throw new Error("Failed to fetch doctor");
    }
}

export const getAppointment = async (id: string) => {
    try {
        const result = await db.select()
            .from(appointments)
            .where(eq(patients.id, id))
            .then(results => results);
        return result;
    } catch (error) {
        console.error("Error fetching appointment:", error);
        throw new Error("Failed to fetch appointment");
    }
}
