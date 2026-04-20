/**
 * Schema validation tests — verifies all tables and columns are properly defined.
 * Run with: tsx packages/db/src/schema.test.ts
 */
import { projects, artworks, furniture, inquiries, settings } from "./schema";

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${msg}`);
  }
}

console.log("Schema validation tests\n");

console.log("projects table:");
assert(typeof projects === "object", "projects table exists");
assert("id" in projects, "has id column");
assert("slug" in projects, "has slug column");
assert("title" in projects, "has title column");
assert("category" in projects, "has category column");
assert("coverUrl" in projects, "has coverUrl column");
assert("gallery" in projects, "has gallery column");
assert("featured" in projects, "has featured column");
assert("publishedAt" in projects, "has publishedAt column");

console.log("\nartworks table:");
assert(typeof artworks === "object", "artworks table exists");
assert("id" in artworks, "has id column");
assert("slug" in artworks, "has slug column");
assert("title" in artworks, "has title column");
assert("series" in artworks, "has series column");
assert("technique" in artworks, "has technique column");
assert("priceArs" in artworks, "has priceArs column");
assert("status" in artworks, "has status column");
assert("widthCm" in artworks, "has widthCm column");
assert("heightCm" in artworks, "has heightCm column");

console.log("\nfurniture table:");
assert(typeof furniture === "object", "furniture table exists");
assert("id" in furniture, "has id column");
assert("slug" in furniture, "has slug column");
assert("materials" in furniture, "has materials column");
assert("dimensions" in furniture, "has dimensions column");
assert("priceArs" in furniture, "has priceArs column");

console.log("\ninquiries table:");
assert(typeof inquiries === "object", "inquiries table exists");
assert("kind" in inquiries, "has kind column");
assert("email" in inquiries, "has email column");
assert("phone" in inquiries, "has phone column");
assert("sourceSlug" in inquiries, "has sourceSlug column");

console.log("\nsettings table:");
assert(typeof settings === "object", "settings table exists");
assert("key" in settings, "has key column");
assert("value" in settings, "has value column");

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
