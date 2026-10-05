import { Download, MonitorPlay, PlayCircle, Swords } from "lucide-react"
import { linkTo } from "@/lib/router"
import { DISCORD_URL } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Badge, SectionCard } from "@/components/ui/panel"
import { PageHeader } from "@/components/layout/PageHeader"
import { ClientPanel } from "@/components/metin2/ClientPanel"

const tabs = [
  { href: "/metin2", label: "Genel Bakış" },
  { href: "/metin2/video", label: "Video" },
]

const youtubeId = "r5rVcPRuus4"

export function Metin2({ path }: { path: string }) {
  return (
    <>
      <PageHeader title="Metin2" path={path} tabs={tabs} className="max-w-5xl" />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        {path === "/metin2/video" ? (
          <SectionCard icon={PlayCircle} title="Tanıtım Videosu" bodyClassName="p-0">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
              title="Metin2 video"
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </SectionCard>
        ) : (
          <Summary />
        )}
      </div>
    </>
  )
}

function Summary() {
  return (
    <>
      <SectionCard
        icon={Swords}
        title="Multi-Client"
        footer={
          <>
            Fiyat: <b className="text-foreground">400₺</b> / 10 gün · 6 client
          </>
        }
        action={
          <Button size="sm" asChild>
            <a href="/buy/metin2" onClick={linkTo("/buy/metin2")}>
              Satın Al
            </a>
          </Button>
        }
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-dashed border-border">
            <img src="/metin2.png" alt="" className="w-12 object-contain" />
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Altı client. Tek pencere.</h2>
              <Badge tone="yellow">Beta</Badge>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Her client'ın seviyesini, HP'sini ve durumunu yan yana izleyin. Hepsini tek bir panelden başlatın,
              durdurun ve ayarlayın.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={MonitorPlay} title="Client Paneli" footer="Clientlar: 6/6 · Build v1.0.0">
        <ClientPanel />
      </SectionCard>

      <SectionCard
        icon={Download}
        title="İndir"
        footer="İndirme bağlantısı Discord sunucumuzda paylaşılır"
        action={
          <Button size="sm" variant="muted" asChild>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
              Discord'dan İndir
            </a>
          </Button>
        }
      >
        <p className="text-sm text-neutral-700">
          Programın güncel sürümünü Discord sunucumuzdan indirebilirsiniz. Güncel sürüm: <b>v1.0.0</b>
        </p>
      </SectionCard>
    </>
  )
}
