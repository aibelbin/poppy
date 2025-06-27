import { pgTable, uuid, timestamp, text, foreignKey, unique, numeric } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations";
import { sql } from "drizzle-orm";

export const doctor = pgTable("doctor", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    fullName: text("full_name"),
    lastName: text("last_name"),
    email: text(),
    password: text(),
    phoneNumber: text("phone_number"),
    gender: text(),
});

export const patients = pgTable("patients", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name"),
    email: text().notNull(),
    password: text().notNull(),
    phoneNumber: text("phone_number"),
    age: numeric(),
    gender: text(),
    doctor: uuid(),
}, (table) => [
    foreignKey({
            columns: [table.doctor],
            foreignColumns: [doctor.id],
            name: "patients_doctor_fkey"
        }),
    unique("patients_email_key").on(table.email),
]);

export const patientsRelations = relations(patients, ({one}) => ({
    doctor: one(doctor, {
        fields: [patients.doctor],
        references: [doctor.id]
    }),
}));

export const doctorRelations = relations(doctor, ({many}) => ({
    patients: many(patients),
}));