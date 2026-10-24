// Turns the xs API reference (Markdown, synced from the bot repo with
// `npm run docs:sync`) into HTML + an index of sections and functions.
// The Markdown is our own file, so its HTML is trusted.
import { Marked } from "marked"
import type { Tokens } from "marked"

export interface DocSection {
  id: string
  title: string
}
export interface DocFunction {
  name: string // "xs.GetPlayer"
  id: string
  group: string // section title
  yields: boolean
}
export interface XsDoc {
  html: string
  sections: DocSection[]
  functions: DocFunction[]
}

/** GitHub-style heading anchor: "2. Rules you must know" -> "2-rules-you-must-know" */
export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[çğıöşü]/g, (c) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" })[c] ?? c)
    .replace(/[^a-z0-9 -]/g, "")
    .trim()
    .replace(/ +/g, "-")
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

// "xs.Kill(vid, timeout=60000) *(yield)*" -> name, rest, yields
const SIG = /^(xs\.[A-Za-z_]+|main)(\(.*?\))?(.*)$/

export function buildDoc(markdown: string, yieldLabel: string): XsDoc {
  const sections: DocSection[] = []
  const functions: DocFunction[] = []
  let group = ""

  // Index first (raw lines), so ids match what the renderer writes
  for (const line of markdown.split(/\r?\n/)) {
    const h2 = line.match(/^## (.+)$/)
    if (h2) {
      group = h2[1].replace(/^\d+\.\s*/, "")
      sections.push({ id: slug(h2[1]), title: h2[1] })
      continue
    }
    const h3 = line.match(/^### (xs\.[A-Za-z_]+)(.*)$/)
    if (h3) {
      functions.push({ name: h3[1], id: h3[1].replace(".", "-"), group, yields: /yield/.test(h3[2]) })
      continue
    }
    const row = line.match(/^\| `(xs\.[A-Za-z_]+)\(/)
    if (row && !functions.some((f) => f.name === row[1])) {
      functions.push({ name: row[1], id: row[1].replace(".", "-"), group, yields: false })
    }
  }

  const md = new Marked({ gfm: true })
  md.use({
    renderer: {
      heading(this: { parser: { parseInline(t: Tokens.Generic[]): string } }, token: Tokens.Heading) {
        const text = token.text
        if (token.depth === 3) {
          const m = text.replace(/\*\(yield\)\*/, "").trim().match(SIG)
          if (m && (m[1].startsWith("xs.") || m[2] === "()")) {
            const yields = /\(yield\)/.test(text)
            const id = m[1].replace(".", "-")
            return (
              `<h3 id="${id}" class="xs-sig"><span><span class="xs-sig-name">${escapeHtml(m[1])}</span>` +
              `${escapeHtml((m[2] ?? "") + m[3])}</span>` +
              (yields ? `<span class="xs-yield">${escapeHtml(yieldLabel)}</span>` : "") +
              `</h3>\n`
            )
          }
        }
        const inner = this.parser.parseInline(token.tokens)
        return `<h${token.depth} id="${slug(text)}">${inner}</h${token.depth}>\n`
      },
      code(token: Tokens.Code) {
        return (
          `<div class="xs-code"><button type="button" class="xs-copy" data-copy>Copy</button>` +
          `<pre><code>${escapeHtml(token.text)}</code></pre></div>\n`
        )
      },
    },
  })

  let html = md.parse(markdown, { async: false }) as string
  // Wide tables scroll inside their own box; table rows that document a
  // function get an anchor so the index can jump to them.
  html = html
    .replace(/<table>/g, '<div class="xs-table"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/<tr>\s*<td><code>(xs\.[A-Za-z_]+)\(/g, (_m, name: string) => `<tr id="${name.replace(".", "-")}"><td><code>${name}(`)
  return { html, sections, functions }
}
