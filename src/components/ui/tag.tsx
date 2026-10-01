import { cn } from "@/lib/utils"

const tones = {
  gold: "bg-gold-dim text-primary border-gold-line",
  green: "bg-success/10 text-success border-success/20",
  yellow: "bg-warning/10 text-warning border-warning/20",
}

interface TagProps {
  tone?: keyof typeof tones
  dot?: boolean
  className?: string
  children: React.ReactNode
}

export function Tag({ tone = "gold", dot = false, className, children }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider",
        tones[tone],
        className
      )}
    >
      {dot && <span className="animate-blink h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_6px_currentColor]" />}
      {children}
    </span>
  )
}
