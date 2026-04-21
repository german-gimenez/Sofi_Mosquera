/**
 * One-off fix: replace \u escapes inside JSX text with actual characters.
 * Only runs on apps/web/src/app files where this issue was found.
 */
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { glob } from "fs/promises";

const ROOT = resolve(__dirname, "../apps/web/src");

const REPLACEMENTS: Array<[RegExp, string]> = [
  // combining tilde with preceding char -> single codepoint
  [/an\\u0303/g, "añ"],
  [/An\\u0303/g, "Añ"],
  [/en\\u0303/g, "eñ"],
  [/un\\u0303/g, "uñ"],
  [/in\\u0303/g, "iñ"],
  [/on\\u0303/g, "oñ"],
  [/N\\u0303/g, "Ñ"],
  [/n\\u0303/g, "ñ"],
  // specific common words
  [/\\u00f1/g, "ñ"],
  [/\\u00d1/g, "Ñ"],
  // other common escapes
  [/\\u00b7/g, "·"],
  [/\\u2014/g, "—"],
  [/\\u2013/g, "–"],
  [/\\u2018/g, "'"],
  [/\\u2019/g, "'"],
  [/\\u201c/g, "\""],
  [/\\u201d/g, "\""],
  [/\\u00e1/g, "á"],
  [/\\u00e9/g, "é"],
  [/\\u00ed/g, "í"],
  [/\\u00f3/g, "ó"],
  [/\\u00fa/g, "ú"],
  [/\\u00c1/g, "Á"],
  [/\\u00c9/g, "É"],
  [/\\u00cd/g, "Í"],
  [/\\u00d3/g, "Ó"],
  [/\\u00da/g, "Ú"],
];

async function fixFile(path: string): Promise<number> {
  const content = await readFile(path, "utf-8");
  let updated = content;
  let changes = 0;

  for (const [pattern, replacement] of REPLACEMENTS) {
    const before = updated;
    updated = updated.replace(pattern, replacement);
    if (updated !== before) {
      const matches = before.match(pattern);
      changes += matches?.length ?? 0;
    }
  }

  if (updated !== content) {
    await writeFile(path, updated, "utf-8");
    console.log(`  ${path.replace(ROOT, "")}: ${changes} replacements`);
  }

  return changes;
}

async function main() {
  const patterns = ["app/**/*.tsx", "components/**/*.tsx"];
  let total = 0;
  let files = 0;

  for (const pattern of patterns) {
    for await (const entry of glob(pattern, { cwd: ROOT })) {
      const fullPath = resolve(ROOT, entry);
      const changes = await fixFile(fullPath);
      if (changes > 0) {
        total += changes;
        files++;
      }
    }
  }

  // Also fix admin + scripts + settings
  const extraDirs = [
    resolve(__dirname, "../apps/admin/src"),
    resolve(__dirname, "../scripts"),
    resolve(__dirname, "../packages/ui/src"),
  ];

  for (const dir of extraDirs) {
    for await (const entry of glob("**/*.{tsx,ts}", { cwd: dir })) {
      const fullPath = resolve(dir, entry);
      // Skip this script itself
      if (fullPath.endsWith("fix-unicode-jsx.ts")) continue;
      const changes = await fixFile(fullPath);
      if (changes > 0) {
        total += changes;
        files++;
      }
    }
  }

  console.log(`\nTotal: ${total} replacements across ${files} files`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
