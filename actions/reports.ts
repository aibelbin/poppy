"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { patients, reports } from "@/db/schema";

export default async function getReports(id: string) {
    const data = await db
        .select({
            patientName: patients.firstName,
            reportUrl: reports.url,
            createdAt: reports.createdAt,
            symptoms: reports.symptoms
        })
        .from(reports)
        .innerJoin(patients, eq(reports.patient, patients.id))
        .where(eq(reports.doctor, id));

    return data;
}