
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Modern Card"),
  description: text("description").notNull().default("Live preview with real-time updates"),
  bgGradientFrom: text("bg_gradient_from").notNull().default("#523091"),
  bgGradientTo: text("bg_gradient_to").notNull().default("#1a0b33"),
  bgOpacityFrom: integer("bg_opacity_from").notNull().default(70),
  bgOpacityTo: integer("bg_opacity_to").notNull().default(14),
  shadowColor: text("shadow_color").notNull().default("#7c3aed"),
  shadowOpacity: real("shadow_opacity").notNull().default(0.3),
  enableHoverEffects: boolean("enable_hover_effects").notNull().default(true),
  enableAnimations: boolean("enable_animations").notNull().default(true),
  cardWidth: integer("card_width").notNull().default(320),
  cardHeight: integer("card_height").notNull().default(200),
  cardPadding: integer("card_padding").notNull().default(24),
  cardBorderRadius: jsonb("card_border_radius").$type<{
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
    unit: string;
  }>().notNull().default({
    topLeft: 16,
    topRight: 16,
    bottomLeft: 16,
    bottomRight: 16,
    unit: "px",
  }),
  cardOpacity: integer("card_opacity").notNull().default(100),
  shadowSettings: jsonb("shadow_settings").$type<{
    x: number;
    y: number;
    blur: number;
    spread: number;
  }>().notNull().default({
    x: 0,
    y: 30,
    blur: 50,
    spread: 0,
  }),
  titleFont: text("title_font").default("Inter"),
  titleSize: integer("title_size").default(18),
  titleWeight: text("title_weight").default("600"),
  titleAlign: text("title_align").default("left"),
  descriptionFont: text("description_font").default("Inter"),
  descriptionSize: integer("description_size").default(14),
  descriptionWeight: text("description_weight").default("400"),
  descriptionAlign: text("description_align").default("left"),
  rotation: real("rotation").default(0),
  scaleX: real("scale_x").default(1),
  scaleY: real("scale_y").default(1),
  blur: real("blur").default(0),
  brightness: real("brightness").default(100),
  contrast: real("contrast").default(100),
  saturation: real("saturation").default(100),
  gradientAngle: integer("gradient_angle").default(135),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  tags: text("tags").array().notNull().default([]),
  preview: text("preview").notNull(),
  author: text("author").notNull(),
  downloads: integer("downloads").notNull().default(0),
  rating: real("rating").notNull().default(0),
  isPremium: boolean("is_premium").notNull().default(false),
  cardData: jsonb("card_data").$type<Record<string, any>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const presentations = pgTable("presentations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Untitled Presentation"),
  description: text("description"),
  content: jsonb("content").$type<Record<string, any>>().default({}),
  isStarred: boolean("is_starred").default(false),
  collaborators: text("collaborators").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const slides = pgTable("slides", {
  id: serial("id").primaryKey(),
  presentationId: integer("presentation_id").references(() => presentations.id).notNull(),
  title: text("title").notNull().default("Untitled Slide"),
  content: jsonb("content").$type<Record<string, any>>().default({}),
  position: integer("position").notNull().default(0),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPresentationSchema = createInsertSchema(presentations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSlideSchema = createInsertSchema(slides).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertPresentation = z.infer<typeof insertPresentationSchema>;
export type Presentation = typeof presentations.$inferSelect;
export type InsertSlide = z.infer<typeof insertSlideSchema>;
export type Slide = typeof slides.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
