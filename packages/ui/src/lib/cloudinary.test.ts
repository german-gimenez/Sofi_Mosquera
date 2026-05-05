/**
 * Sanity tests for the Cloudinary helper module.
 * Standalone test runner — no framework. Run with `tsx`.
 */
import { strict as assert } from "node:assert";
import {
  SOFI_NAMESPACE,
  assertSofiPath,
  isSofiPath,
  cldUrl,
  cldCard,
  cldVideoUrl,
  isVideoPublicId,
  videoPublicId,
} from "./cloudinary";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ✗ ${name}`);
    console.log(`      ${(e as Error).message}`);
    failed++;
  }
}

console.log("\nSOFI_NAMESPACE:");
test("namespace is the canonical 'sofi-mosquera'", () => {
  assert.equal(SOFI_NAMESPACE, "sofi-mosquera");
});

console.log("\nassertSofiPath():");
test("accepts a valid public_id", () => {
  const out = assertSofiPath("sofi-mosquera/projects/casa-bf/01");
  assert.equal(out, "sofi-mosquera/projects/casa-bf/01");
});
test("accepts a video: prefixed id", () => {
  const out = assertSofiPath("video:sofi-mosquera/projects/casa-laura/03");
  assert.equal(out, "video:sofi-mosquera/projects/casa-laura/03");
});
test("accepts a full https URL (backward compat)", () => {
  const url = "https://cdn.example.com/img.jpg";
  assert.equal(assertSofiPath(url), url);
});
test("rejects empty/null", () => {
  assert.throws(() => assertSofiPath(""), /empty public_id/);
  assert.throws(() => assertSofiPath(null), /empty public_id/);
});
test("rejects out-of-namespace public_id", () => {
  assert.throws(
    () => assertSofiPath("suplement-app/foo"),
    /must live under "sofi-mosquera\/"/
  );
  assert.throws(
    () => assertSofiPath("sofimosquera/foo"), // missing dash → wrong folder
    /must live under "sofi-mosquera\/"/
  );
  assert.throws(
    () => assertSofiPath("loose-asset"),
    /must live under "sofi-mosquera\/"/
  );
});
test("rejects uppercase, spaces, traversal", () => {
  assert.throws(() => assertSofiPath("sofi-mosquera/Projects/x"), /invalid characters/);
  assert.throws(() => assertSofiPath("sofi-mosquera/projects/x x"), /invalid characters/);
  assert.throws(() => assertSofiPath("sofi-mosquera/../escape"), /invalid characters/);
});
test("ctx is included in the error message", () => {
  assert.throws(
    () => assertSofiPath("oops/foo", "projects.cover_url"),
    /projects\.cover_url/
  );
});

console.log("\nisSofiPath():");
test("returns true for valid namespace path", () => {
  assert.equal(isSofiPath("sofi-mosquera/x/y"), true);
});
test("returns true for video: prefix path", () => {
  assert.equal(isSofiPath("video:sofi-mosquera/x"), true);
});
test("returns false for null/empty/foreign paths", () => {
  assert.equal(isSofiPath(null), false);
  assert.equal(isSofiPath(""), false);
  assert.equal(isSofiPath("suplement-app/foo"), false);
  assert.equal(isSofiPath("sofimosquera/foo"), false);
});
test("recognizes namespace inside a full Cloudinary URL", () => {
  assert.equal(
    isSofiPath(
      "https://res.cloudinary.com/dsrvlln9j/image/upload/sofi-mosquera/projects/x/01"
    ),
    true
  );
});

console.log("\ncldUrl() output:");
test("includes the version segment", () => {
  const url = cldUrl("sofi-mosquera/projects/casa-bf/cover", { w: 800 });
  assert.match(url, /\/v\d+\//, "URL should contain v{ASSET_VERSION}/");
});
test("returns full URL pass-through unchanged", () => {
  const u = "https://cdn.example.com/image.jpg";
  assert.equal(cldUrl(u), u);
});
test("returns empty string for null", () => {
  assert.equal(cldUrl(null), "");
  assert.equal(cldUrl(undefined), "");
});
test("cldCard uses fill 800x1000 g_auto", () => {
  const url = cldCard("sofi-mosquera/x/y");
  assert.match(url, /w_800/);
  assert.match(url, /h_1000/);
  assert.match(url, /c_fill/);
  assert.match(url, /g_auto/);
});

console.log("\nvideo helpers:");
test("isVideoPublicId detects prefix", () => {
  assert.equal(isVideoPublicId("video:foo/bar"), true);
  assert.equal(isVideoPublicId("foo/bar"), false);
  assert.equal(isVideoPublicId(null), false);
});
test("videoPublicId() adds prefix", () => {
  assert.equal(videoPublicId("sofi-mosquera/projects/x/01"), "video:sofi-mosquera/projects/x/01");
});
test("cldVideoUrl strips video: prefix", () => {
  const u = cldVideoUrl("video:sofi-mosquera/projects/x/01");
  assert.match(u, /\/sofi-mosquera\/projects\/x\/01\.mp4$/);
  assert.doesNotMatch(u, /video:/);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
