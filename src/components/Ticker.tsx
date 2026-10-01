const items = [
  { value: "2", label: "games" },
  { value: "6", label: "clients per license" },
  { value: "3", label: "target colors" },
  { value: "$20", label: "per month" },
  { value: "400₺", label: "10 days" },
  { value: "v1.0.0", label: "current build" },
]

// The list is rendered twice so the -50% scroll loops without a gap
export function Ticker() {
  return (
    <div className="overflow-hidden border-y border-border bg-surface py-4" aria-hidden="true">
      <div className="animate-ticker flex w-max gap-10">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-10 whitespace-nowrap font-mono text-xs font-bold text-subtle">
            <span className="flex items-center gap-2.5">
              <span className="text-xl text-primary">{item.value}</span>
              {item.label}
            </span>
            <span>—</span>
          </div>
        ))}
      </div>
    </div>
  )
}
