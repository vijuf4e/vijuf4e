import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const tones = {
  neutral: "border-border bg-card text-foreground",
  blue: "border-transparent bg-accent-soft text-accent",
  green: "border-transparent bg-green-50 text-success",
  yellow: "border-transparent bg-amber-50 text-warning",
}

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: keyof typeof tones
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-xl border border-border bg-card", className)}>{children}</div>
}

/** Settings-style card: gray title strip, white body, optional footer with note + action */
export function SectionCard({
  icon: Icon,
  title,
  footer,
  action,
  className,
  bodyClassName,
  children,
}: {
  icon?: LucideIcon
  title: string
  footer?: React.ReactNode
  action?: React.ReactNode
  className?: string
  bodyClassName?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("overflow-hidden rounded-xl border border-border bg-muted/60", className)}>
      <h3 className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-700">
        {Icon && <Icon className="h-4 w-4" strokeWidth={1.8} />}
        {title}
      </h3>
      <div className={cn("rounded-xl border-y border-border bg-card p-6 [&:last-child]:border-b-0", bodyClassName)}>
        {children}
      </div>
      {(footer || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm text-neutral-700">
          <span>{footer}</span>
          {action}
        </div>
      )}
    </section>
  )
}

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}
