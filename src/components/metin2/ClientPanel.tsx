// HTML recreation of the multi-client window; values mirror public/metin2/running.png
const clients = [
  { name: "Lon****", server: "[RUBY] Lucifer · CH1", level: 82, bars: [82, 64, 40] },
  { name: "Dark****", server: "Ezel · CH1", level: 89, bars: [90, 78, 22] },
  { name: "Ice****", server: "[RUBY] Lucifer · CH1", level: 97, bars: [76, 88, 70] },
  { name: "Sil****", server: "[RUBY] Lucifer · CH4", level: 61, bars: [96, 58, 84] },
  { name: "Long****", server: "[RUBY] Lucifer · CH4", level: 92, bars: [70, 46, 18] },
  { name: "Nigh****", server: "[RUBY] Lucifer · CH1", level: 77, bars: [88, 92, 52] },
]

const barColors = ["bg-[#ef4444]", "bg-[#3b82f6]", "bg-[#eab308]"]

export function ClientPanel() {
  return (
    <div className="glass glass-lit shadow-[0_30px_80px_-20px_var(--gold-glow)]" aria-label="Multi-client window preview">
      <div className="flex justify-between border-b border-border px-3.5 py-3 text-xs font-semibold">
        <span>Xweardes | www.xweardes.com</span>
        <span className="font-mono text-subtle">— + ×</span>
      </div>
      <div className="flex flex-col gap-1.5 p-2.5">
        {clients.map((client, i) => (
          <div
            key={client.name}
            className="grid grid-cols-[22px_1fr_64px_70px] items-center gap-2.5 rounded-lg border-l-2 border-success bg-white/[0.025] px-2.5 py-2 text-xs tabular-nums"
          >
            <span className="font-mono text-[11px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-0">
              <span className="block truncate">{client.name}</span>
              <span className="block truncate text-[10.5px] text-subtle">{client.server}</span>
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              Lv {client.level}
              <span className="flex items-center gap-1 text-[10px] font-bold text-success">
                <span className="animate-blink h-1.5 w-1.5 rounded-full bg-current" />
                RUNNING
              </span>
            </span>
            <span className="flex flex-col gap-[3px]">
              {client.bars.map((width, b) => (
                <span
                  key={b}
                  className={`animate-breathe block h-[3px] origin-left rounded-sm ${barColors[b]}`}
                  style={{ width: `${width}%`, animationDuration: `${3.4 + (i % 2) * 0.9}s` }}
                />
              ))}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between border-t border-border px-3.5 py-2.5 font-mono text-[10.5px] text-subtle">
        <span>
          Clients: <b className="text-primary">6/6</b>
        </span>
        <span>Build: v1.0.0</span>
      </div>
    </div>
  )
}
