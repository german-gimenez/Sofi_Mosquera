/**
 * Design tokens validation — verifies Brand DNA compliance.
 * Run with: tsx packages/tokens/src/tokens.test.ts
 */
import { colors, fonts, tailwindTheme } from "./index";

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

console.log("Design tokens validation\n");

console.log("Brand DNA colors:");
assert(colors.negro.base === "#111111", "negro base is #111111");
assert(colors.negro.suave === "#1A1A1A", "negro suave is #1A1A1A");
assert(colors.gris.nav === "#B5B0A8", "gris nav is #B5B0A8");
assert(colors.crema === "#EAE7E0", "crema is #EAE7E0");
assert(colors.blanco.calido === "#F5F3EE", "blanco calido is #F5F3EE");

console.log("\nForbidden colors (Brand DNA don'ts):");
const allColors = JSON.stringify(colors);
assert(!allColors.includes("#FFFFFF"), "no pure white #FFFFFF anywhere");
assert(!allColors.includes("#000000"), "no pure black #000000 anywhere");

console.log("\nTypography:");
assert(fonts.heading.includes("Instrument Serif") || fonts.heading.includes("Athena"), "heading font is serif");
assert(fonts.body.includes("Jost"), "body font is Jost");

console.log("\nTailwind theme:");
assert(tailwindTheme.colors.brand.negro === "#111111", "tailwind brand-negro matches");
assert(tailwindTheme.colors.brand["blanco-calido"] === "#F5F3EE", "tailwind blanco-calido matches");
assert(tailwindTheme.fontFamily.heading.length > 0, "heading font family defined");
assert(tailwindTheme.fontFamily.body.length > 0, "body font family defined");

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
