import { useState } from "react"
import { Check, Crosshair, Image, Keyboard, MessageCircle, Palette, PlayCircle, SlidersHorizontal, Sparkles, Timer, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { linkTo } from "@/lib/router"
import { useT } from "@/lib/i18n"
import type { Text } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Badge, SectionCard } from "@/components/ui/panel"
import { PageHeader } from "@/components/layout/PageHeader"

const tabs = [
  { href: "/valorant", label: { tr: "Genel Bakış", en: "Overview" } },
  { href: "/valorant/features", label: { tr: "Özellikler", en: "Features" } },
  { href: "/valorant/videos", label: { tr: "Videolar", en: "Videos" } },
]

const features: { icon: LucideIcon; title: Text; description: Text }[] = [
  {
    icon: Palette,
    title: { tr: "Çoklu Renk Algılama", en: "Multi-Color Detection" },
    description: { tr: "Ayarlanabilir renk aralığıyla 3 hedef renge kadar.", en: "Up to 3 target colors with an adjustable color range." },
  },
  {
    icon: Zap,
    title: { tr: "Spray ve Tap Modları", en: "Spray and Tap Modes" },
    description: { tr: "Ateş stilini istediğin an, hareket halindeyken bile değiştir.", en: "Switch firing style anytime, even while moving." },
  },
  {
    icon: Timer,
    title: { tr: "Hassas Zamanlama", en: "Precise Timing" },
    description: { tr: "FOV, pre-delay, tap ve spray hızı ayarları.", en: "FOV, pre-delay, tap and spray speed settings." },
  },
  {
    icon: SlidersHorizontal,
    title: { tr: "Config Yöneticisi", en: "Config Manager" },
    description: { tr: "Ayarlarını kaydet, içe aktar ve kod olarak paylaş.", en: "Save, import and share your settings as a code." },
  },
  {
    icon: Keyboard,
    title: { tr: "Özel Kısayol", en: "Custom Hotkey" },
    description: { tr: "Tetiği istediğin tuşa bağla.", en: "Bind the trigger to any key." },
  },
  {
    icon: MessageCircle,
    title: { tr: "Öncelikli Destek", en: "Priority Support" },
    description: { tr: "Discord'da ekipten doğrudan yardım.", en: "Direct help from the team on Discord." },
  },
]

const videos = ["https://streamable.com/e/ob2vuv", "https://streamable.com/e/6xiorv"]

const stats = [
  { label: { tr: "FOV", en: "FOV" }, value: "4" },
  { label: { tr: "Renk aralığı", en: "Color range" }, value: "70" },
  { label: { tr: "Tap hızı", en: "Tap speed" }, value: "10" },
]

export function Valorant({ path }: { path: string }) {
  const t = useT()
  return (
    <>
      <PageHeader
        title="Valorant"
        path={path}
        tabs={tabs.map((tab) => ({ ...tab, label: t(tab.label) }))}
        className="max-w-5xl"
      />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        {path === "/valorant/features" ? <Features /> : path === "/valorant/videos" ? <Videos /> : <Summary />}
      </div>
    </>
  )
}

function Summary() {
  const [zoom, setZoom] = useState(false)
  const t = useT()

  return (
    <>
      <SectionCard
        icon={Crosshair}
        title="Color Trigger"
        footer={
          <>
            {t("Fiyat", "Price")}: <b className="text-foreground">$20</b> / {t("ay", "month")}
          </>
        }
        action={
          <Button size="sm" asChild>
            <a href="/buy/valorant" onClick={linkTo("/buy/valorant")}>
              {t("Satın Al", "Buy")}
            </a>
          </Button>
        }
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-dashed border-border">
            <img src="/valorant.png" alt="" className="h-9 object-contain" />
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{t("Her değer, senin ayarına göre.", "Every value, tuned your way.")}</h2>
              <Badge tone="green">{t("Aktif", "Active")}</Badge>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t(
                "Üç hedef renge kadar, spray ve tap modları ve hassas zamanlama ayarları. Ayarlarını kaydet ve kod olarak paylaş.",
                "Up to three target colors, spray and tap modes and precise timing settings. Save your settings and share them as a code."
              )}
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-lg border border-border">
          {stats.map((s) => (
            <div key={s.label.en} className="px-4 py-3">
              <div className="text-xs text-muted-foreground">{t(s.label)}</div>
              <div className="text-lg font-semibold tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={Image} title={t("Menü Önizleme", "Menu Preview")} footer={t("Büyütmek için görsele tıklayın", "Click the image to enlarge")}>
        <img
          src="/menu-preview.png"
          alt={t("Xweardes menüsü", "Xweardes menu")}
          width={704}
          height={761}
          className="mx-auto h-auto w-auto max-w-full cursor-zoom-in rounded-lg border border-border"
          onClick={() => setZoom(true)}
        />
      </SectionCard>

      {zoom && (
        <div
          className="animate-fade-in fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80 p-4"
          onClick={() => setZoom(false)}
        >
          <img src="/menu-preview.png" alt="" className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  )
}

function Features() {
  const t = useT()
  return (
    <SectionCard icon={Sparkles} title={t("Özellikler", "Features")} bodyClassName="p-0">
      <p className="px-6 pt-5 pb-3 text-sm text-neutral-700">
        {t("Color Trigger ile gelen tüm özellikler", "Everything included with Color Trigger")}
      </p>
      <ul className="divide-y divide-border">
        {features.map(({ icon: Icon, title, description }) => (
          <li key={title.en} className="flex items-center gap-4 px-6 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium">{t(title)}</span>
              <span className="block text-sm text-muted-foreground">{t(description)}</span>
            </span>
            <Check className="h-4 w-4 text-success" />
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

function Videos() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {videos.map((src, i) => (
        <SectionCard key={src} icon={PlayCircle} title={`Video ${i + 1}`} bodyClassName="p-0">
          <div className="relative aspect-video w-full">
            <iframe src={src} title={`Valorant video ${i + 1}`} className="absolute inset-0 h-full w-full" allowFullScreen allow="autoplay" />
          </div>
        </SectionCard>
      ))}
    </div>
  )
}
