export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-surface py-7 px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Xweardes. All rights reserved.
        </p>
        <a
          href="https://cheatglobal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center hover:opacity-80 transition-opacity"
        >
          <img src="/cheatglobal-logo.png" alt="CheatGlobal" className="h-8" />
        </a>
      </div>
    </footer>
  )
}
