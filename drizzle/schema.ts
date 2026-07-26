import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Inquiry/quote request records submitted via the contact form.
 * Stores all form fields plus a JSON array of uploaded file names.
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  /** Customer's full name */
  name: varchar("name", { length: 255 }).notNull(),
  /** Customer's email address */
  email: varchar("email", { length: 320 }).notNull(),
  /** Full phone number including dial code (optional) */
  phone: varchar("phone", { length: 64 }),
  /** Company or Individual */
  customerType: varchar("customerType", { length: 32 }).notNull(),
  /** Country / region */
  country: varchar("country", { length: 128 }).notNull(),
  /** Manufacturing process type */
  processType: varchar("processType", { length: 128 }).notNull(),
  /** Project description (optional) */
  description: text("description"),
  /** JSON array of uploaded file names, e.g. '["part.stl","drawing.pdf"]' */
  filesJson: text("filesJson"),
  /** JSON array of file metadata objects with name and storageUrl, for admin file access */
  filesMetaJson: text("filesMetaJson"),
  /** When the inquiry was submitted */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;
