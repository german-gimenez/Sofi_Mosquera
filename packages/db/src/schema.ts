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
  summary: text("summary"),
  category: varchar("category", { length: 50 }).notNull().default("residencial"),
  year: integer("year"),
  location: varchar("location", { length: 255 }),
  coverUrl: text("cover_url"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  featured: boolean("featured").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const artworks = pgTable("artworks", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  series: varchar("series", { length: 100 }),
  year: integer("year"),
  widthCm: integer("width_cm"),
  heightCm: integer("height_cm"),
  technique: varchar("technique", { length: 255 }),
  priceArs: integer("price_ars"),
  status: varchar("status", { length: 50 }).notNull().default("disponible"),
  coverUrl: text("cover_url"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  featured: boolean("featured").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const furniture = pgTable("furniture", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  materials: varchar("materials", { length: 500 }),
  dimensions: varchar("dimensions", { length: 255 }),
  priceArs: integer("price_ars"),
  coverUrl: text("cover_url"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  featured: boolean("featured").notNull().default(false),
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: jsonb("value"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
