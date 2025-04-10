import { pgTable, text, serial, integer, boolean, timestamp, real, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(),
  teamId: integer("team_id"),
  managerId: integer("manager_id"),
  language: text("language").default("en"),
  avatarUrl: text("avatar_url"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Team schema
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  leaderId: integer("leader_id"),
  description: text("description"),
  memberCount: integer("member_count").default(0),
  performance: real("performance").default(0),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
});

// Objective schema
export const objectives = pgTable("objectives", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  progress: real("progress").default(0),
  teamId: integer("team_id"),
  ownerId: integer("owner_id"),
  isCompanyObjective: boolean("is_company_objective").default(false),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
});

export const insertObjectiveSchema = createInsertSchema(objectives).omit({
  id: true,
});

// Key Result schema
export const keyResults = pgTable("key_results", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  progress: real("progress").default(0),
  objectiveId: integer("objective_id").notNull(),
  ownerId: integer("owner_id"),
  startValue: real("start_value").default(0),
  targetValue: real("target_value"),
  currentValue: real("current_value"),
  isCompleted: boolean("is_completed").default(false),
});

export const insertKeyResultSchema = createInsertSchema(keyResults).omit({
  id: true,
});

// Meeting schema
export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  userId1: integer("user_id_1").notNull(),
  userId2: integer("user_id_2").notNull(),
  status: text("status").default("scheduled"),
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
});

// Resource schema
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  url: text("url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export type Objective = typeof objectives.$inferSelect;
export type InsertObjective = z.infer<typeof insertObjectiveSchema>;

export type KeyResult = typeof keyResults.$inferSelect;
export type InsertKeyResult = z.infer<typeof insertKeyResultSchema>;

export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

// Financial Data schema
export const financialData = pgTable("financial_data", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  revenue: real("revenue"),
  cost: real("cost"),
  ebitda: real("ebitda"),
  profitAfterTaxMargin: real("profit_after_tax_margin"),
  cumulativeAudience: integer("cumulative_audience"),
  notes: text("notes"),
  objectiveId: integer("objective_id"),
  uploadedById: integer("uploaded_by_id"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertFinancialDataSchema = createInsertSchema(financialData).omit({
  id: true,
  uploadedAt: true,
});

export type FinancialData = typeof financialData.$inferSelect;
export type InsertFinancialData = z.infer<typeof insertFinancialDataSchema>;

// Cycle schema
export const cycles = pgTable("cycles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("upcoming"), // upcoming, active, completed
  type: text("type").notNull(), // quarterly, annual, custom
  createdById: integer("created_by_id"),
  createdAt: timestamp("created_at").defaultNow(),
  isDefault: boolean("is_default").default(false),
});

export const insertCycleSchema = createInsertSchema(cycles).omit({
  id: true,
  createdAt: true,
});

export type Cycle = typeof cycles.$inferSelect;
export type InsertCycle = z.infer<typeof insertCycleSchema>;
