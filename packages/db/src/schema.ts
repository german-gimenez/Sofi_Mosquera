import {
  pgTable,
  text,
  serial,
  timestamp,
  boolean,
  integer,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  titleEn: varchar("title_en", { length: 255 }),
  subtitle: varchar("subtitle", { length: 255 }),
  subtitleEn: varchar("subtitle_en", { length: 255 }),
  summary: text("summary"),
  summaryEn: text("summary_en"),
  intervention: varchar("intervention", { length: 255 }),
  interventionEn: varchar("intervention_en", { length: 255 }),
  concept: text("concept"),
  conceptEn: text("concept_en"),
  description: text("description"),
  descriptionEn: text("description_en"),
  technicalData: jsonb("technical_data").$type<{
    areaM2?: number;
    highlights?: string[];
  }>(),
  category: varchar("category", { length: 50 }).notNull().default("residencial"),
  year: integer("year"),
  location: varchar("location", { length: 255 }),
  coverUrl: text("cover_url"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  featured: boolean("featured").notNull().default(false),
  visible: boolean("visible").notNull().default(true),
  position: integer("position").notNull().default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const series = pgTable("series", {
  slug: varchar("slug", { length: 50 }).primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  titleEn: varchar("title_en", { length: 100 }),
  description: text("description"),
  descriptionEn: text("description_en"),
  coverUrl: text("cover_url"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const artworks = pgTable("artworks", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  titleEn: varchar("title_en", { length: 255 }),
  series: varchar("series", { length: 100 }),
  seriesSlug: varchar("series_slug", { length: 50 }),
  year: integer("year"),
  widthCm: integer("width_cm"),
  heightCm: integer("height_cm"),
  technique: varchar("technique", { length: 255 }),
  techniqueEn: varchar("technique_en", { length: 255 }),
  priceArs: integer("price_ars"),
  priceVisible: boolean("price_visible").notNull().default(true),
  status: varchar("status", { length: 50 }).notNull().default("disponible"),
  coverUrl: text("cover_url"),
  contextUrl: text("context_url"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  featured: boolean("featured").notNull().default(false),
  position: integer("position").notNull().default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const furniture = pgTable("furniture", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  titleEn: varchar("title_en", { length: 255 }),
  description: text("description"),
  descriptionEn: text("description_en"),
  materials: varchar("materials", { length: 500 }),
  materialsEn: varchar("materials_en", { length: 500 }),
  dimensions: varchar("dimensions", { length: 255 }),
  priceArs: integer("price_ars"),
  isCatalog: boolean("is_catalog").notNull().default(false),
  coverUrl: text("cover_url"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  featured: boolean("featured").notNull().default(false),
  position: integer("position").notNull().default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  kind: varchar("kind", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  message: text("message"),
  sourceSlug: varchar("source_slug", { length: 255 }),
  locale: varchar("locale", { length: 5 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: jsonb("value"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
