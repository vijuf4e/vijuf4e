import { useEffect, useState } from "react"

export interface Rates {
  usd: number
  eur: number
  /** Date the rates were published (ECB, via Frankfurter), YYYY-MM-DD */
  date: string
}

/** Yesterday in Istanbul as YYYY-MM-DD; prices are converted at the previous day's rate */
const yesterday = () =>
  new Date(Date.now() - 86_400_000).toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" })

let request: Promise<Rates | null> | undefined

/** One request per page load; weekends and holidays fall back to the last published day */
function loadRates() {
  request ??= fetch(`https://api.frankfurter.dev/v2/rates?base=TRY&quotes=USD,EUR&date=${yesterday()}`)
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((rows: { date: string; quote: string; rate: number }[]) => {
      const rate = (q: string) => rows.find((r) => r.quote === q)?.rate
      const usd = rate("USD")
      const eur = rate("EUR")
      return usd && eur ? { usd, eur, date: rows[0].date } : null
    })
    .catch(() => null)
  return request
}

export function useRates() {
  const [rates, setRates] = useState<Rates | null>(null)
  useEffect(() => {
    let live = true
    loadRates().then((r) => live && setRates(r))
    return () => {
      live = false
    }
  }, [])
  return rates
}

/** "≈ $66 · €60" for a lira price like "3.149₺"; null for other currencies or before rates load */
export function fxText(price: string, rates: Rates | null) {
  if (!rates || !price.endsWith("₺")) return null
  const tl = parseInt(price.replace(/[^0-9]/g, ""))
  return `≈ $${Math.round(tl * rates.usd)} · €${Math.round(tl * rates.eur)}`
}
