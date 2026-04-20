import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function createDb(connectionString?: string) {
  const sql = neon(connectionString ?? process.env.DATABASE_URL!);
  return drizzle({ client: sql, schema });
}

export type Db = ReturnType<typeof createDb>;

export * from "./schema";
export { eq, and, or, desc, asc, sql, like, ilike, inArray, isNull, isNotNull, count } from "drizzle-orm";
