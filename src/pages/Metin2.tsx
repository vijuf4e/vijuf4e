import metin2Logo from "@/assets/metin2.png"
import { ArrowRight, Download, Images, MonitorPlay, PlayCircle, Swords } from "lucide-react"
import { linkTo } from "@/lib/router"
import { DISCORD_URL, PATCHER_URL } from "@/lib/products"
import { useT } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Badge, SectionCard } from "@/components/ui/panel"
import { PageHeader } from "@/components/layout/PageHeader"
import { ClientPanel } from "@/components/metin2/ClientPanel"
import { PythonDocs } from "@/components/metin2/PythonDocs"
import { Gallery } from "@/components/metin2/Gallery"

const tabs = [
  { href: "/metin2", label: { tr: "Genel Bakış", en: "Overview" } },
  { href: "/metin2/gallery", label: { tr: "Galeri", en: "Gallery" } },
  { href: "/metin2/video", label: { tr: "Video", en: "Video" } },
  { href: "/metin2/python", label: { tr: "Python API", en: "Python API" } },
]

const youtubeId = "r5rVcPRuus4"

export function Metin2({ path }: { path: string }) {
  const t = useT()
  // The API reference needs room for its side index
  const width = path === "/metin2/python" || path === "/metin2/gallery" ? "max-w-6xl" : "max-w-5xl"
  return (
    <>
      <PageHeader
        title="Metin2"
        path={path}
        tabs={tabs.map((tab) => ({ ...tab, label: t(tab.label) }))}
        className={width}
      />
      <div className={`mx-auto flex w-full ${width} flex-col gap-6 px-4 py-8 sm:px-6`}>
        {path === "/metin2/python" ? (
          <PythonDocs />
        ) : path === "/metin2/gallery" ? (
          <Gallery />
        ) : path === "/metin2/video" ? (
          <SectionCard icon={PlayCircle} title={t("Tanıtım Videosu", "Showcase Video")} bodyClassName="p-0">
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
  const t = useT()
  return (
    <>
      <SectionCard
        icon={Swords}
        title="Multi-Client"
        footer={
          <>
            {t("Fiyat", "Price")}: <b className="text-foreground">400₺</b> / {t("10 gün · 6 client", "10 days · 6 clients")}
          </>
        }
        action={
          <Button size="sm" asChild>
            <a href="/buy/metin2" onClick={linkTo("/buy/metin2")}>
              {t("Satın Al", "Buy")}
            </a>
          </Button>
        }
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-dashed border-border">
            <img src={metin2Logo} alt="" className="w-12 object-contain" />
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{t("Altı client. Tek pencere.", "Six clients. One window.")}</h2>
              <Badge tone="yellow">Beta</Badge>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t(
                "Her client'ın seviyesini, HP'sini ve durumunu yan yana izleyin. Hepsini tek bir panelden başlatın, durdurun ve ayarlayın.",
                "Watch every client's level, HP and status side by side. Start, stop and configure them all from a single panel."
              )}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={Images}
        title={t("Galeri", "Gallery")}
        footer={t("38 ekran görüntüsü · client ve panel", "38 screenshots · client and panel")}
        action={
          <Button size="sm" variant="outline" asChild>
            <a href="/metin2/gallery" onClick={linkTo("/metin2/gallery")}>
              {t("Tümünü gör", "View all")} <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {["dll_01_main", "dll_02_bots_farm", "panel_01_main"].map((f) => (
            <a
              key={f}
              href="/metin2/gallery"
              onClick={linkTo("/metin2/gallery")}
              className="group block aspect-[1612/872] overflow-hidden rounded-lg border border-border bg-neutral-900"
            >
              <img
                src={`/metin2/gallery/thumb/${f}.webp`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover object-left-top transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </a>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={MonitorPlay} title={t("Client Paneli", "Client Panel")} footer={t("Clientlar: 6/6 · Build v1.0.0", "Clients: 6/6 · Build v1.0.0")}>
        <ClientPanel />
      </SectionCard>

      <SectionCard
        icon={Download}
        title={t("İndir", "Download")}
        footer={
          <>
            {t("Sorun mu var? ", "Having trouble? ")}
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
              {t("Discord'a yazın", "Ask on Discord")}
            </a>
          </>
        }
        action={
          // A button instead of a link so hovering doesn't show the server URL in the status bar;
          // the server sends Content-Disposition: attachment, so the page stays put
          <Button size="sm" onClick={() => (window.location.href = PATCHER_URL)}>
            {t("Patcher'ı İndir", "Download Patcher")}
          </Button>
        }
      >
        <p className="text-sm text-neutral-700">
          {t(
            "Patcher'ı indirip çalıştırın; programın güncel sürümünü kendisi indirir ve güncel tutar. Güncel sürüm:",
            "Download and run the Patcher; it fetches the latest version of the program and keeps it up to date. Current version:"
          )}{" "}
          <b>v1.0.0</b>
        </p>
      </SectionCard>
    </>
  )
}
