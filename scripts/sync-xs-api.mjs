// Copies the xs Python API reference (English + Turkish) from the bot repo
// into the site. Source of truth: rig7/docs/XS_API.md and XS_API.tr.md (the
// bot's test checks that both document every function and setting). Run
// after the bot's API changes:
//
//   npm run docs:sync                    (default: ../rig7/docs)
//   npm run docs:sync -- C:\path\to\rig7\docs
import { copyFileSync, existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const srcDir = resolve(process.argv[2] ?? resolve(root, "..", "rig7", "docs"))
const files = [
  ["XS_API.md", "xs-api.md"],
  ["XS_API.tr.md", "xs-api.tr.md"],
]

let failed = false
for (const [from, to] of files) {
  const src = resolve(srcDir, from)
  const dst = resolve(root, "src", "content", to)
  if (!existsSync(src)) {
    console.error(`Not found: ${src}`)
    failed = true
    continue
  }
  const text = readFileSync(src, "utf8")
  if (!text.startsWith("# xs")) {
    console.error(`${src} does not look like the xs API reference`)
    failed = true
    continue
  }
  const before = existsSync(dst) ? readFileSync(dst, "utf8") : ""
  copyFileSync(src, dst)
  console.log(before === text ? `${to}: already up to date` : `${to}: updated from ${src}`)
}
if (failed) {
  console.error("Pass the folder: npm run docs:sync -- <path to rig7\\docs>")
  process.exit(1)
}
