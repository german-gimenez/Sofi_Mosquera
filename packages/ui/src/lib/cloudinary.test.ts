/**
 * Cloudinary helper tests.
 * Run: npx tsx packages/ui/src/lib/cloudinary.test.ts
 */
import {
  cldUrl,
  cldThumb,
  cldCard,
  cldHero,
  cldSquare,
  cldZoom,
  cldGallery,
  cldArtwork,
  cldEnhanced,
  cldUpscaled,
  cldPortrait,
  cldSrcSet,
} from "./cloudinary";

let pass = 0;
let fail = 0;

function assert(cond: boolean, msg: string) {
  if (cond) {
    pass++;
    console.log(`  ✓ ${msg}`);
  } else {
    fail++;
    console.error(`  ✗ FAIL: ${msg}`);
  }
}

console.log("Cloudinary helper tests\n");

console.log("cldUrl basic:");
const url = cldUrl("sofi-mosquera/projects/casa-susel/01");
assert(url.includes("res.cloudinary.com"), "has Cloudinary host");
assert(url.includes("f_auto"), "has f_auto");
assert(url.includes("q_auto"), "has q_auto");
assert(url.includes("w_1200"), "default width is 1200");
assert(url.endsWith("/sofi-mosquera/projects/casa-susel/01"), "ends with public_id");

console.log("\ncldUrl options:");
assert(cldUrl("x", { w: 600 }).includes("w_600"), "custom width");
assert(cldUrl("x", { h: 400 }).includes("h_400"), "custom height");
assert(cldUrl("x", { crop: "fill" }).includes("c_fill"), "crop mode");
assert(cldUrl("x", { g: "auto" }).includes("g_auto"), "gravity");
assert(cldUrl("x", { effect: "improve" }).includes("e_improve"), "effect");
assert(cldUrl("x", { removeBg: true }).includes("e_background_removal"), "remove bg");
assert(cldUrl("x", { generativeFill: true }).includes("b_gen_fill"), "generative fill");
assert(cldUrl("x", { dpr: 2 }).includes("dpr_2"), "dpr");

console.log("\nPass-through for URLs:");
const externalUrl = "https://example.com/img.jpg";
assert(cldUrl(externalUrl) === externalUrl, "full URLs returned as-is");
assert(cldUrl(null) === "", "null returns empty");
assert(cldUrl(undefined) === "", "undefined returns empty");
assert(cldUrl("") === "", "empty string returns empty");

console.log("\nPresets:");
assert(cldThumb("x").includes("w_600") && cldThumb("x").includes("h_750"), "cldThumb 600x750");
assert(cldCard("x").includes("w_800") && cldCard("x").includes("h_1000"), "cldCard 800x1000");
assert(cldHero("x").includes("w_2000") && cldHero("x").includes("h_1200"), "cldHero 2000x1200");
assert(cldSquare("x").includes("w_600") && cldSquare("x").includes("h_600"), "cldSquare 600x600");
assert(cldZoom("x").includes("w_2400"), "cldZoom w_2400");
assert(cldZoom("x").includes("q_90"), "cldZoom q_90");
assert(cldGallery("x").includes("w_1600") && cldGallery("x").includes("h_1000"), "cldGallery 1600x1000");
assert(cldArtwork("x").includes("c_fit"), "cldArtwork uses c_fit");

console.log("\nAI presets:");
assert(cldEnhanced("x").includes("e_improve"), "cldEnhanced has e_improve");
assert(cldUpscaled("x").includes("e_upscale"), "cldUpscaled has e_upscale");
assert(cldPortrait("x").includes("g_face:auto"), "cldPortrait uses face gravity");
assert(cldPortrait("x").includes("e_sharpen"), "cldPortrait has sharpen");

console.log("\nsrcset:");
const srcset = cldSrcSet("x", [400, 800, 1200]);
assert(srcset.includes("400w"), "srcset has 400w");
assert(srcset.includes("800w"), "srcset has 800w");
assert(srcset.includes("1200w"), "srcset has 1200w");
// Count entries by `w, ` separator (between entries, not inside URLs)
assert(srcset.split(", ").length === 3, "srcset has 3 entries");

console.log("\nBrand DNA compliance:");
assert(!cldUrl("x").includes("#FFFFFF"), "no pure white in transformations");
assert(!cldUrl("x").includes("#000000"), "no pure black in transformations");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
