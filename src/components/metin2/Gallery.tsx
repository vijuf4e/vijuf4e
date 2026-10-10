import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react"
import { useT, type Text } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// Screenshots rendered off-screen at 2x from the real UI code (rig7 tools/uishot);
// names, servers and IPs are masked. Full size in /metin2/gallery, 720px previews in /thumb.
type Group = "client" | "event" | "windows" | "panel"

type Shot = { file: string; group: Group; title: Text; desc: Text }

const shots: Shot[] = [
  // ── Client (DLL) ──
  { file: "dll_01_main", group: "client", title: { tr: "Ana sayfa", en: "Main" },
    desc: { tr: "İksir, hız, zoom, dirilme ve hasar ayarları; solda canlı radar ve rota.", en: "Potions, speed, zoom, revive and damage settings; live radar and route on the left." } },
  { file: "dll_01b_main_exploit", group: "client", title: { tr: "Ana sayfa · Exploit", en: "Main · Exploit" },
    desc: { tr: "Exploit hasar modu: Main / Dummy, otomatik uyku ve uygulanan tempo.", en: "Exploit damage mode: Main / Dummy, auto sleep and the applied tempo." } },
  { file: "dll_02_bots_farm", group: "client", title: { tr: "Bots · Farm Bot", en: "Bots · Farm Bot" },
    desc: { tr: "Rota kaydı ve yönetimi, rota üzerindeki davranışlar ve Level Bot.", en: "Route recording and management, on-route behaviour and the Level Bot." } },
  { file: "dll_03_bots_damage_filter", group: "client", title: { tr: "Bots · Hasar Filtresi", en: "Bots · Damage Filter" },
    desc: { tr: "Haritadaki moblardan yalnızca seçtiklerine saldır.", en: "Attack only the mobs you pick from the current map." } },
  { file: "dll_04_pickup", group: "client", title: { tr: "Pickup", en: "Pickup" },
    desc: { tr: "Yerdeki eşyaları toplama modu ve filtreleri.", en: "Ground item pickup mode and filters." } },
  { file: "dll_05_market_dialog", group: "client", title: { tr: "Market · Diyalog", en: "Market · Dialog" },
    desc: { tr: "Satıcı NPC'si ve diyalog cevapları.", en: "Shop NPC and dialog answers." } },
  { file: "dll_06_market_items", group: "client", title: { tr: "Market · Eşyalar", en: "Market · Items" },
    desc: { tr: "Sat / At / Satma kuralları, otomatik satış ve Enasir.", en: "Sell / Drop / Don't sell rules, auto selling and Enasir." } },
  { file: "dll_07_items_use", group: "client", title: { tr: "Items · Use Item", en: "Items · Use Item" },
    desc: { tr: "Eşyaları süreli olarak otomatik kullan.", en: "Use items automatically on a timer." } },
  { file: "dll_08_items_quick_use", group: "client", title: { tr: "Items · Quick Use", en: "Items · Quick Use" },
    desc: { tr: "Görselli hızlı kullanım: etkisi bitince yeniden kullanılır.", en: "Visual quick use: re-applied when the effect wears off." } },
  { file: "dll_09_items_attribute", group: "client", title: { tr: "Items · Efsun", en: "Items · Attribute" },
    desc: { tr: "Efsun değerine göre tut / at filtresi.", en: "Keep / drop filter by attribute value." } },
  { file: "dll_16_helper", group: "client", title: { tr: "Helper", en: "Helper" },
    desc: { tr: "Map Changer, koordinata git, Auto Stack/Split, radar renkleri, zamanlayıcılar.", en: "Map Changer, go to coordinates, Auto Stack/Split, radar colors, timers." } },
  { file: "dll_17_security", group: "client", title: { tr: "Security", en: "Security" },
    desc: { tr: "GM / oyuncu algılama ve tepkiler, beyaz liste.", en: "GM / player detection with reactions and a whitelist." } },
  { file: "dll_18_scripts", group: "client", title: { tr: "Scripts", en: "Scripts" },
    desc: { tr: "Python betik yöneticisi (xs API).", en: "Python script manager (xs API)." } },
  { file: "dll_19_scripts_quick", group: "client", title: { tr: "Scripts · Hızlı Komut", en: "Scripts · Quick Command" },
    desc: { tr: "Tek satırlık Python komutu çalıştır.", en: "Run a one-line Python command." } },
  // ── Event ──
  { file: "dll_10_event_alchemy", group: "event", title: { tr: "Event · Simya", en: "Event · Alchemy" },
    desc: { tr: "Günlük simya görevi, tüm karakterlerde, depo ve külçe.", en: "Daily alchemy quest across all characters, storage and bars." } },
  { file: "dll_11_event_goblin", group: "event", title: { tr: "Event · Goblin", en: "Event · Goblin" },
    desc: { tr: "Hazine avı: anahtar hedefi ve Doblon ödülleri.", en: "Treasure hunt: key target and Doblon rewards." } },
  { file: "dll_12_event_hammer_energy", group: "event", title: { tr: "Event · Çekiç Enerjisi", en: "Event · Hammer Energy" },
    desc: { tr: "Çekiçle enerji parçası: envanterden ya da silah satıcısından.", en: "Energy fragments with hammers: from the inventory or the weapon shop." } },
  { file: "dll_13_event_okey", group: "event", title: { tr: "Event · Okey", en: "Event · Okey" },
    desc: { tr: "Okey kartlarını otomatik oyna.", en: "Play Okey cards automatically." } },
  { file: "dll_14_event_yutnori", group: "event", title: { tr: "Event · Yutnori", en: "Event · Yutnori" },
    desc: { tr: "Yutnori'yi pencere açmadan otomatik oyna.", en: "Play Yutnori automatically without opening the window." } },
  { file: "dll_15_event_time_rift", group: "event", title: { tr: "Event · Zaman Çatlağı", en: "Event · Time Rift" },
    desc: { tr: "Cep saati alımı, heykel ve zindana giriş döngüsü.", en: "Pocket watch buying, the statue and the dungeon entry loop." } },
  // ── Windows / popups ──
  { file: "dll_24_full_map", group: "windows", title: { tr: "Büyük harita", en: "Full map" },
    desc: { tr: "Harita seçici ve rota çizimi; çift tıkla git.", en: "Map picker and route drawing; double-click to go." } },
  { file: "dll_23_level_settings", group: "windows", title: { tr: "Level Settings", en: "Level Settings" },
    desc: { tr: "Seviye aralığına göre otomatik config değişimi.", en: "Switch configs automatically by level range." } },
  { file: "dll_20_popup_connection", group: "windows", title: { tr: "Bağlantı bilgisi", en: "Connection info" },
    desc: { tr: "Proxy, çıkış IP'si, mod, oturum süresi ve atılma sayacı.", en: "Proxy, exit IP, mode, session time and kick counter." } },
  { file: "dll_21_popup_profile", group: "windows", title: { tr: "Profiller", en: "Profiles" },
    desc: { tr: "Ayar profillerini yükle, kaydet, sil.", en: "Load, save and delete setting profiles." } },
  { file: "dll_22_popup_stat_priority", group: "windows", title: { tr: "Stat önceliği", en: "Stat priority" },
    desc: { tr: "Auto Status için stat sırası.", en: "Stat order for Auto Status." } },
  { file: "dll_25_alchemy_quest_titles", group: "windows", title: { tr: "Simya görev adları", en: "Alchemy quest titles" },
    desc: { tr: "Farklı dillerdeki sunucular için görev başlıkları.", en: "Quest titles for servers in other languages." } },
  { file: "dll_26_helper_quest_titles", group: "windows", title: { tr: "Görev adı ayarları", en: "Quest title settings" },
    desc: { tr: "Görev eşleştirmesi için başlıklar (TR / EN).", en: "Titles used for quest matching (TR / EN)." } },
  // ── Panel ──
  { file: "panel_01_main", group: "panel", title: { tr: "Panel", en: "Panel" },
    desc: { tr: "Tüm slotlar tek pencerede: durum, kanal, başlat / durdur.", en: "Every slot in one window: status, channel, start / stop." } },
  { file: "panel_02_main_5_columns", group: "panel", title: { tr: "Panel · 60 slot", en: "Panel · 60 slots" },
    desc: { tr: "5 sütunda 60 slotun hepsi.", en: "All 60 slots across 5 columns." } },
  { file: "panel_03_card_hover", group: "panel", title: { tr: "Slot kartı", en: "Slot card" },
    desc: { tr: "Kartın üzerine gelince seviye ve durum.", en: "Level and status on hover." } },
  { file: "panel_04_slot_settings", group: "panel", title: { tr: "Slot ayarları", en: "Slot settings" },
    desc: { tr: "Hesap, sunucu / kanal, karakter, otomatik giriş ve config.", en: "Account, server / channel, character, auto login and config." } },
  { file: "panel_05_char_creator", group: "panel", title: { tr: "Karakter oluşturucu", en: "Character creator" },
    desc: { tr: "Krallık, sınıf, cinsiyet ve sayı ile otomatik karakter açma.", en: "Create characters automatically by empire, class, gender and count." } },
  { file: "panel_06_proxy_settings", group: "panel", title: { tr: "Proxy ayarları", en: "Proxy settings" },
    desc: { tr: "Slot başına Direct ve Client proxy.", en: "Direct and client proxy per slot." } },
  { file: "panel_07_global_general", group: "panel", title: { tr: "Genel ayarlar", en: "Global settings" },
    desc: { tr: "Tümünü başlat / durdur, açılış modu ve yeniden başlatma sınırları.", en: "Start / stop all, launch mode and restart limits." } },
  { file: "panel_08_global_time_manager", group: "panel", title: { tr: "Time Manager", en: "Time Manager" },
    desc: { tr: "Slotları saatle ya da süreyle başlat / durdur.", en: "Start / stop slots at a time or after a delay." } },
  { file: "panel_09_global_slot_manager", group: "panel", title: { tr: "Slot Manager", en: "Slot Manager" },
    desc: { tr: "Bir slot bitince sıradakini başlat.", en: "Start the next slot when one finishes." } },
  { file: "panel_10_global_account", group: "panel", title: { tr: "Hesap aktarımı", en: "Account import" },
    desc: { tr: "Hesap listesini slotlara tek tıkla dağıt.", en: "Spread an account list over slots in one click." } },
  { file: "panel_11_global_proxies", group: "panel", title: { tr: "Proxy listesi", en: "Proxy list" },
    desc: { tr: "SOCKS5 / HTTP proxy ekle, test et, içe aktar.", en: "Add, test and import SOCKS5 / HTTP proxies." } },
]

const groups: { id: Group | "all"; label: Text }[] = [
  { id: "all", label: { tr: "Tümü", en: "All" } },
  { id: "client", label: { tr: "Client", en: "Client" } },
  { id: "event", label: { tr: "Event", en: "Event" } },
  { id: "windows", label: { tr: "Pencereler", en: "Windows" } },
  { id: "panel", label: { tr: "Panel", en: "Panel" } },
]

const full = (s: Shot) => `/metin2/gallery/${s.file}.webp`
const thumb = (s: Shot) => `/metin2/gallery/thumb/${s.file}.webp`

export function Gallery() {
  const t = useT()
  const [filter, setFilter] = useState<Group | "all">("all")
  const [open, setOpen] = useState<number | null>(null)
  const list = useMemo(() => (filter === "all" ? shots : shots.filter((s) => s.group === filter)), [filter])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {groups.map((g) => {
            const count = g.id === "all" ? shots.length : shots.filter((s) => s.group === g.id).length
            const on = filter === g.id
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setFilter(g.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors",
                  on
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-neutral-700 hover:bg-muted"
                )}
              >
                {t(g.label)}
                <span className={cn("text-xs tabular-nums", on ? "opacity-70" : "text-muted-foreground")}>{count}</span>
              </button>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {t("Gerçek arayüz · isimler gizlendi", "Real interface · names masked")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => (
          <button
            key={s.file}
            type="button"
            onClick={() => setOpen(i)}
            className="group overflow-hidden rounded-xl border border-border bg-card text-left transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <div className="relative aspect-[1612/872] overflow-hidden bg-neutral-900">
              <img
                src={thumb(s)}
                alt={t(s.title)}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-left-top transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <span className="absolute right-2 top-2 rounded-md bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Maximize2 className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="px-3.5 py-3">
              <div className="text-sm font-medium">{t(s.title)}</div>
              <div className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{t(s.desc)}</div>
            </div>
          </button>
        ))}
      </div>

      {open !== null && <Lightbox list={list} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  )
}

function Lightbox({
  list,
  index,
  onIndex,
  onClose,
}: {
  list: Shot[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const t = useT()
  const s = list[index]
  const n = list.length
  const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex])
  const touchX = useRef<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowRight") go(1)
      else if (e.key === "ArrowLeft") go(-1)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [go, onClose])

  // Neighbours load in the background so arrowing through is instant
  useEffect(() => {
    for (const d of [1, -1]) new Image().src = full(list[(index + d + n) % n])
  }, [index, list, n])

  const arrow = "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition-colors hover:bg-white/20"

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-black/90"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm tabular-nums text-white/60">
          {index + 1} / {n}
        </span>
        <button type="button" onClick={onClose} aria-label={t("Kapat", "Close")} className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
        <button type="button" aria-label={t("Önceki", "Previous")} className={cn(arrow, "left-2 sm:left-4")} onClick={(e) => (e.stopPropagation(), go(-1))}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <img
          key={s.file}
          src={full(s)}
          alt={t(s.title)}
          onClick={(e) => e.stopPropagation()}
          className="animate-pop-in max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        />
        <button type="button" aria-label={t("Sonraki", "Next")} className={cn(arrow, "right-2 sm:right-4")} onClick={(e) => (e.stopPropagation(), go(1))}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 pb-3 pt-4 text-center text-white sm:px-6" onClick={(e) => e.stopPropagation()}>
        <div className="text-base font-medium">{t(s.title)}</div>
        <div className="mx-auto mt-1 max-w-2xl text-sm text-white/65">{t(s.desc)}</div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-4 sm:justify-center sm:px-6" onClick={(e) => e.stopPropagation()}>
        {list.map((x, i) => (
          <button
            key={x.file}
            type="button"
            ref={i === index ? (el) => el?.scrollIntoView({ inline: "center", block: "nearest" }) : undefined}
            onClick={() => onIndex(i)}
            aria-label={t(x.title)}
            className={cn(
              "h-12 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-opacity",
              i === index ? "border-white opacity-100" : "border-transparent opacity-45 hover:opacity-80"
            )}
          >
            <img src={thumb(x)} alt="" loading="lazy" className="h-full w-full object-cover object-left-top" />
          </button>
        ))}
      </div>
    </div>
  )
}
