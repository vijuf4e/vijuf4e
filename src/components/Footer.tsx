export function Footer() {
  return (
    <footer id="contact" className="border-t border-border py-7 px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Xweardes. All rights reserved.
        </p>
        <a
          href="https://cheatglobal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-border bg-card hover:bg-accent px-4 py-2 transition-colors"
        >
          <img src="/cheatglobal-logo.png" alt="CheatGlobal" className="h-6" />
        </a>
      </div>
    </footer>
  )
}
