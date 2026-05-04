/**
 * i18n helpers test
 * Run with: tsx apps/web/src/lib/i18n-helpers.test.ts
 */
import { pickLocale, formatPriceArs, formatPriceOrInquire } from "./i18n-helpers";

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

console.log("i18n-helpers\n");

console.log("pickLocale():");
assert(pickLocale("Hola", "Hello", "es") === "Hola", "ES returns ES value");
assert(pickLocale("Hola", "Hello", "en") === "Hello", "EN returns EN value");
assert(pickLocale("Hola", null, "en") === "Hola", "EN with null EN falls back to ES");
assert(pickLocale("Hola", "", "en") === "Hola", "EN with empty EN falls back to ES");
assert(pickLocale("Hola", undefined, "en") === "Hola", "EN with undefined EN falls back to ES");
assert(pickLocale("Hola", "Hello", "fr") === "Hola", "Unknown locale falls back to ES");

console.log("\nformatPriceArs():");
assert(formatPriceArs(250000, "es") === "$ 250.000", "ES formats with dot separators");
assert(formatPriceArs(250000, "en") === "ARS 250,000", "EN formats with comma separators");
assert(formatPriceArs(null, "es") === null, "null price returns null");
assert(formatPriceArs(undefined, "en") === null, "undefined price returns null");

console.log("\nformatPriceOrInquire():");
assert(
  formatPriceOrInquire(250000, true, "es", "Consultar") === "$ 250.000",
  "visible price formatted (es)"
);
assert(
  formatPriceOrInquire(250000, false, "es", "Consultar") === "Consultar",
  "hidden price returns inquire label"
);
assert(
  formatPriceOrInquire(null, true, "es", "Consultar") === "Consultar",
  "null price returns inquire label even if visible"
);
assert(
  formatPriceOrInquire(300000, true, "en", "Inquire") === "ARS 300,000",
  "visible price in english"
);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
