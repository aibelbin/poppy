import { pgTable, uuid, timestamp, text, foreignKey, unique, numeric, bigint, json } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations";
import { sql } from "drizzle-orm"

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

export const personalisation = pgTable("personalisation", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "personalisation_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id"),
	data: text(),
	questions: json(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [patients.id],
			name: "personalisation_user_id_fkey"
		}),
]);

export const patientsRelations = relations(patients, ({one, many}) => ({
	doctor: one(doctor, {
		fields: [patients.doctor],
		references: [doctor.id]
	}),
	personalisations: many(personalisation),
}));

export const doctorRelations = relations(doctor, ({many}) => ({
	patients: many(patients),
}));

export const personalisationRelations = relations(personalisation, ({one}) => ({
	patient: one(patients, {
		fields: [personalisation.userId],
		references: [patients.id]
	}),
}));