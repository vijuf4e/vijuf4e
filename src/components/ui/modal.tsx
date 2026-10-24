import { useEffect } from "react"
import { X } from "lucide-react"
import { useT } from "@/lib/i18n"

export function Modal({
  open,
  onClose,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  const t = useT()
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="animate-pop-in relative w-full max-w-[425px] overflow-hidden rounded-xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("Kapat", "Close")}
          className="absolute right-4 top-4 rounded-md p-1 text-neutral-500 hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-6">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-border bg-muted/50 px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}
