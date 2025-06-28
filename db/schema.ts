import { pgTable, uuid, timestamp, text, foreignKey, bigint, unique, numeric, json } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { relations } from "drizzle-orm/relations";

export const doctors = pgTable("doctors", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text(),
	password: text(),
	phoneNumber: text("phone_number"),
	gender: text(),
});

export const caretakers = pgTable("caretakers", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "caretakers_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	patient: uuid(),
	phoneNumber: text("phone_number"),
}, (table) => [
	foreignKey({
			columns: [table.patient],
			foreignColumns: [patients.id],
			name: "caretakers_patient_fkey"
		}),
]);

export const reports = pgTable("reports", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "reports_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	url: text(),
	doctor: uuid(),
	patient: uuid(),
	priority: text(),
	symptoms: text(),
}, (table) => [
	foreignKey({
			columns: [table.doctor],
			foreignColumns: [doctors.id],
			name: "reports_doctor_fkey"
		}),
	foreignKey({
			columns: [table.patient],
			foreignColumns: [patients.id],
			name: "reports_patient_fkey"
		}),
]);

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
			foreignColumns: [doctors.id],
			name: "patients_doctor_fkey"
		}),
	unique("patients_email_key").on(table.email),
]);

export const prescriptions = pgTable("prescriptions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "prescriptions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	patient: uuid(),
	course: numeric(),
	timing: json(),
	stock: numeric(),
	medName: text("med_name"),
}, (table) => [
	foreignKey({
			columns: [table.patient],
			foreignColumns: [patients.id],
			name: "prescriptions_patient_fkey"
		}),
]);

export const appointments = pgTable("appointments", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "appointments_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	patient: uuid(),
	doctor: uuid(),
	status: text(),
	time: timestamp({ withTimezone: true, mode: 'string' }),
	notes: text(),
	type: text(),
}, (table) => [
	foreignKey({
			columns: [table.doctor],
			foreignColumns: [doctors.id],
			name: "appointments_doctor_fkey"
		}),
	foreignKey({
			columns: [table.patient],
			foreignColumns: [patients.id],
			name: "appointments_patient_fkey"
		}),
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

export const caretakersRelations = relations(caretakers, ({one}) => ({
	patient: one(patients, {
		fields: [caretakers.patient],
		references: [patients.id]
	}),
}));

export const patientsRelations = relations(patients, ({one, many}) => ({
	caretakers: many(caretakers),
	reports: many(reports),
	doctor: one(doctors, {
		fields: [patients.doctor],
		references: [doctors.id]
	}),
	prescriptions: many(prescriptions),
	appointments: many(appointments),
	personalisations: many(personalisation),
}));

export const reportsRelations = relations(reports, ({one}) => ({
	doctor: one(doctors, {
		fields: [reports.doctor],
		references: [doctors.id]
	}),
	patient: one(patients, {
		fields: [reports.patient],
		references: [patients.id]
	}),
}));

export const doctorsRelations = relations(doctors, ({many}) => ({
	reports: many(reports),
	patients: many(patients),
	appointments: many(appointments),
}));

export const prescriptionsRelations = relations(prescriptions, ({one}) => ({
	patient: one(patients, {
		fields: [prescriptions.patient],
		references: [patients.id]
	}),
}));

export const appointmentsRelations = relations(appointments, ({one}) => ({
	doctor: one(doctors, {
		fields: [appointments.doctor],
		references: [doctors.id]
	}),
	patient: one(patients, {
		fields: [appointments.patient],
		references: [patients.id]
	}),
}));

export const personalisationRelations = relations(personalisation, ({one}) => ({
	patient: one(patients, {
		fields: [personalisation.userId],
		references: [patients.id]
	}),
}));