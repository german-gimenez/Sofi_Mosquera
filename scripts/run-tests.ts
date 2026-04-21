/**
 * Run all tests in the monorepo.
 */
import { spawn } from "child_process";
import { resolve } from "path";

const ROOT = resolve(__dirname, "..");

const TESTS = [
  { name: "Structure audit", cmd: "tsx", args: ["scripts/audit-build.ts"] },
  { name: "Schema", cmd: "tsx", args: ["packages/db/src/schema.test.ts"] },
  { name: "Design tokens", cmd: "tsx", args: ["packages/tokens/src/tokens.test.ts"] },
  { name: "Cloudinary helper", cmd: "tsx", args: ["packages/ui/src/lib/cloudinary.test.ts"] },
];

async function runTest(test: (typeof TESTS)[number]): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`\n=== ${test.name} ===`);
    const proc = spawn("npx", [test.cmd, ...test.args], {
      cwd: ROOT,
      stdio: "inherit",
      shell: true,
    });
    proc.on("close", (code) => {
      resolve(code === 0);
    });
  });
}

async function main() {
  const results: Array<{ name: string; ok: boolean }> = [];

  for (const test of TESTS) {
    const ok = await runTest(test);
    results.push({ name: test.name, ok });
  }

  console.log("\n\n=== SUMMARY ===");
  for (const r of results) {
    console.log(`  ${r.ok ? "✓" : "✗"} ${r.name}`);
  }

  const allPass = results.every((r) => r.ok);
  console.log(`\n${allPass ? "All tests passed" : "Some tests failed"}`);
  process.exit(allPass ? 0 : 1);
}

main();
