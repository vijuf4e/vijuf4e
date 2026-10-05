import { useT } from "@/lib/i18n"

// HTML recreation of the multi-client window; values mirror public/metin2/running.png
const clients = [
  { name: "Lon****", server: "[RUBY] Lucifer · CH1", level: 82, bars: [82, 64, 40] },
  { name: "Dark****", server: "Ezel · CH1", level: 89, bars: [90, 78, 22] },
  { name: "Ice****", server: "[RUBY] Lucifer · CH1", level: 97, bars: [76, 88, 70] },
  { name: "Sil****", server: "[RUBY] Lucifer · CH4", level: 61, bars: [96, 58, 84] },
  { name: "Long****", server: "[RUBY] Lucifer · CH4", level: 92, bars: [70, 46, 18] },
  { name: "Nigh****", server: "[RUBY] Lucifer · CH1", level: 77, bars: [88, 92, 52] },
]

const barColors = ["bg-red-500", "bg-blue-500", "bg-yellow-500"]

export function ClientPanel() {
  const t = useT()
  return (
    <div className="overflow-hidden rounded-lg border border-border" aria-label={t("Multi-client pencere önizlemesi", "Multi-client window preview")}>
      <div className="flex justify-between border-b border-border bg-muted/60 px-4 py-2.5 text-xs font-medium">
        <span>Xweardes | www.xweardes.com</span>
        <span className="font-mono text-neutral-400">— + ×</span>
      </div>
      <div className="divide-y divide-border">
        {clients.map((client, i) => (
          <div
            key={client.name}
            className="grid grid-cols-[24px_1fr_90px] items-center gap-3 px-4 py-2.5 text-sm tabular-nums sm:grid-cols-[24px_1fr_110px_120px]"
          >
            <span className="font-mono text-xs text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-0">
              <span className="block truncate font-medium">{client.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{client.server}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Lv {client.level}
              <span className="flex items-center gap-1.5 font-medium text-success">
                <span className="animate-blink h-1.5 w-1.5 rounded-full bg-current" />
                {t("Çalışıyor", "Running")}
              </span>
            </span>
            <span className="hidden flex-col gap-1 sm:flex">
              {client.bars.map((width, b) => (
                <span key={b} className="h-1 rounded-full bg-muted">
                  <span className={`block h-full rounded-full ${barColors[b]}`} style={{ width: `${width}%` }} />
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between border-t border-border bg-muted/60 px-4 py-2 text-xs text-muted-foreground">
        <span>
          {t("Clientlar", "Clients")}: <b className="text-foreground">6/6</b>
        </span>
        <span>Build: v1.0.0</span>
      </div>
    </div>
  )
}
