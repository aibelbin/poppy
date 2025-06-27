"use server";

import { db } from "@/db";
import { patients } from "@/db/schema";

export const addPatient = (formData: Record<string, string>) => {
    // db.insert().values({ firstName: "" })
}

export const getPatient = (id: string) => {}

export const getDoctor = (id: string) => {}

export const getAppointment = (id: string) => {}
