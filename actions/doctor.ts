"use server";

import { db } from "@/db";
import { patients, doctors } from "@/db/schema";

interface DoctorFormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    email: string;
    password: string;
}
export const addDoctor = (formData: DoctorFormData) => {
    try{
    return db.insert(doctors).values({
        fullName: `${formData.firstName} ${formData.lastName}`,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        email: formData.email,
        password: formData.password,
    });
    } catch (error) {
        console.error("Error adding doctor:", error);
        throw new Error("Failed to add doctor");
    }

}

import { eq } from "drizzle-orm";

export const getDoctor = (id: string) => {
    try {
        return db.select()
            .from(doctors)
            .where(eq(doctors.id, id))
            .then(results => results[0]);
    } catch (error) {
        console.error("Error fetching doctor:", error);
        throw new Error("Failed to fetch doctor");
    }
}

export const getPatientsList = (id: string) => {
    try {
        return db.select()
            .from(patients)
            .where(eq(patients.doctor, id))
            .then(results => results);
    } catch (error) {
        console.error("Error fetching patients list:", error);
        throw new Error("Failed to fetch patiensts list");
    }
}

export const getPatientReports = (id: string) => {

}

export const getAppointment = (id: string) => {}

export const getTotalAppointments = (id: string) => {}