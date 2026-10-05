import { useState } from "react"
import { Check, Crosshair, Image, Keyboard, MessageCircle, Palette, PlayCircle, SlidersHorizontal, Sparkles, Timer, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { linkTo } from "@/lib/router"
import { Button } from "@/components/ui/button"
import { Badge, SectionCard } from "@/components/ui/panel"
import { PageHeader } from "@/components/layout/PageHeader"

const tabs = [
  { href: "/valorant", label: "Genel Bakış" },
  { href: "/valorant/features", label: "Özellikler" },
  { href: "/valorant/videos", label: "Videolar" },
]

const features: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Palette, title: "Çoklu Renk Algılama", description: "Ayarlanabilir renk aralığıyla 3 hedef renge kadar." },
  { icon: Zap, title: "Spray ve Tap Modları", description: "Ateş stilini istediğin an, hareket halindeyken bile değiştir." },
  { icon: Timer, title: "Hassas Zamanlama", description: "FOV, pre-delay, tap ve spray hızı ayarları." },
  { icon: SlidersHorizontal, title: "Config Yöneticisi", description: "Ayarlarını kaydet, içe aktar ve kod olarak paylaş." },
  { icon: Keyboard, title: "Özel Kısayol", description: "Tetiği istediğin tuşa bağla." },
  { icon: MessageCircle, title: "Öncelikli Destek", description: "Discord'da ekipten doğrudan yardım." },
]

const videos = ["https://streamable.com/e/ob2vuv", "https://streamable.com/e/6xiorv"]

const stats = [
  { label: "FOV", value: "4" },
  { label: "Renk aralığı", value: "70" },
  { label: "Tap hızı", value: "10" },
]

export function Valorant({ path }: { path: string }) {
  return (
    <>
      <PageHeader title="Valorant" path={path} tabs={tabs} className="max-w-5xl" />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        {path === "/valorant/features" ? <Features /> : path === "/valorant/videos" ? <Videos /> : <Summary />}
      </div>
    </>
  )
}

function Summary() {
  const [zoom, setZoom] = useState(false)

  return (
    <>
      <SectionCard
        icon={Crosshair}
        title="Color Trigger"
        footer={
          <>
            Fiyat: <b className="text-foreground">$20</b> / ay
          </>
        }
        action={
          <Button size="sm" asChild>
            <a href="/buy/valorant" onClick={linkTo("/buy/valorant")}>
              Satın Al
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
              <h2 className="text-lg font-semibold">Her değer, senin ayarına göre.</h2>
              <Badge tone="green">Aktif</Badge>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Üç hedef renge kadar, spray ve tap modları ve hassas zamanlama ayarları. Ayarlarını kaydet ve kod olarak
              paylaş.
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-lg border border-border">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-3">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-lg font-semibold tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={Image} title="Menü Önizleme" footer="Büyütmek için görsele tıklayın">
        <img
          src="/menu-preview.png"
          alt="Xweardes menüsü"
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
  return (
    <SectionCard icon={Sparkles} title="Özellikler" bodyClassName="p-0">
      <p className="px-6 pt-5 pb-3 text-sm text-neutral-700">Color Trigger ile gelen tüm özellikler</p>
      <ul className="divide-y divide-border">
        {features.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex items-center gap-4 px-6 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium">{title}</span>
              <span className="block text-sm text-muted-foreground">{description}</span>
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
