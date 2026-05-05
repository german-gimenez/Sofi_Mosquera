/**
 * Run all tests in the monorepo.
 *
 * Some tests (DB↔Cloudinary cross-audit) need to run from inside a workspace
 * package because they import packages that ship as ESM bare specifiers (e.g.
 * `@neondatabase/serverless` resolves only when the package's own
 * `node_modules` is the entry point). Those entries use `pnpm --filter` and a
 * relative path inside the package.
 */
import { spawn } from "child_process";
import { resolve } from "path";

const ROOT = resolve(__dirname, "..");

interface TestSpec {
  name: string;
  cmd: string;
  args: string[];
  /** Fail the suite if this test exits non-zero (default true) */
  required?: boolean;
}

const TESTS: TestSpec[] = [
  { name: "Structure audit (V3)", cmd: "tsx", args: ["scripts/audit-build.ts"] },
  { name: "V3 fixes audit", cmd: "tsx", args: ["scripts/audit-v3-fixes.ts"] },
  { name: "Schema", cmd: "tsx", args: ["packages/db/src/schema.test.ts"] },
  { name: "Design tokens", cmd: "tsx", args: ["packages/tokens/src/tokens.test.ts"] },
  {
    name: "Cloudinary helper",
    cmd: "pnpm",
    args: ["--filter", "@sofi/ui", "exec", "tsx", "src/lib/cloudinary.test.ts"],
  },
  { name: "i18n helpers", cmd: "tsx", args: ["apps/web/src/lib/i18n-helpers.test.ts"] },
  { name: "Structured data", cmd: "tsx", args: ["apps/web/src/lib/structured-data.test.ts"] },
  // DB ↔ Cloudinary cross-audit. Needs Cloudinary inventory to be fresh; if
  // tmp-cloudinary-inventory.json is older than 24h the audit-cloudinary.ts
  // step in the test refreshes it. Marked optional so a missing
  // DATABASE_URL_UNPOOLED in CI doesn't block the rest.
  {
    name: "DB ↔ Cloudinary cross-audit",
    cmd: "pnpm",
    args: ["--filter", "@sofi/db", "exec", "tsx", "audit-db-vs-cloudinary.ts"],
  },
];

async function runTest(test: TestSpec): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`\n=== ${test.name} ===`);
    const useNpx = test.cmd === "tsx";
    const cmd = useNpx ? "npx" : test.cmd;
    const args = useNpx ? [test.cmd, ...test.args] : test.args;
    const proc = spawn(cmd, args, {
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
