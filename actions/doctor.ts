"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { patients, doctors, appointments, reports } from "@/db/schema";

interface DoctorFormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    email: string;
    password: string;
}

export const addDoctor = async (formData: DoctorFormData) => {
    try{
    const result = await db.insert(doctors).values({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
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

export const getDoctor = async (id: string) => {
    try {
        const result = await db.select()
            .from(doctors)
            .where(eq(doctors.id, id))
            .then(results => results);
        return result[0];
    } catch (error) {
        console.error("Error fetching doctor:", error);
        throw new Error("Failed to fetch doctor");
    }
}

export const getPatientsList = async (id: string) => {
    try {
        const result = await db.select()
            .from(patients)
            .where(eq(patients.doctor, id))
            .then(results => results);
        return result;
    } catch (error) {
        console.error("Error fetching patients list:", error);
        throw new Error("Failed to fetch patiensts list");
    }
}

export const getPatientReports = async (id: string) => {
    try {
        const result = await db.select()
            .from(reports)
            .where(eq(reports.doctor, id))
            .then(results => results);
        return result;
    } catch (error) {
        console.error("Error fetching patient reports:", error);
        throw new Error("Failed to fetch patient reports");
    }
}

export const getAppointment = async (id: string) => {
    try {
        const result = await db.select()
            .from(appointments)
            .where(eq(doctors.id, id))
            .then(results => results);
        return result;
    } catch (error) {
        console.error("Error fetching appointment:", error);
        throw new Error("Failed to fetch appointment");
    }
}

export const getTotalAppointments = async (id: string) => {
    try {
        const result = await db.select()
            .from(appointments)
            .where(eq(doctors.id, id))
            .then(results => results);
        return result.length;
    } catch (error) {
        console.error("Error fetching total appointments:", error);
        throw new Error("Failed to fetch total appointments");
    }
}