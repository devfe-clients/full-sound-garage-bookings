import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Wallet, Instagram, ChevronRight, Wrench, Radio, Zap, Film } from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";
import { SERVICES } from "@/lib/booking-store";
import { HeroScrub } from "@/components/ui/hero-scrub";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Full Sound Garage — Agendamento online" },
      {
        name: "description",
        content:
          "Insulfilme, envelopamento, som e LEDs. Escolha o serviço, veja os horários livres e reserve. Pagamento no local.",
      },
      { property: "og:title", content: "Full Sound Garage — Agendamento online" },
      {
        property: "og:description",
        content: "Reserve seu horário para insulfilme, envelopamento, som e LEDs.",
      },
    ],
  }),
  component: Index,
});

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  insulfilme: <Film className="h-7 w-7" />,
  envelopamento: <Wrench className="h-7 w-7" />,
  som: <Radio className="h-7 w-7" />,
  leds: <Zap className="h-7 w-7" />,
};

function Index() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a", color: "#ffffff" }}>
      <BrandHeader />

      <main>
        {/* HERO SCRUB */}
        <HeroScrub
          frameCount={300}
          frameUrl={(i) =>
            `https://raw.githubusercontent.com/duthiljean/ferrari-hero-demo/main/${String(i + 1).padStart(4, "0")}.webp`
          }
          titleTop="FULL SOUND"
          titleBottom="GARAGE"
          accentHex="#ea580c"
        >
          {/* Conteúdo sobreposto ao card central do hero */}
          <div className="relative z-30 flex h-full flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-black/80 via-black/30 to-black/20">
            <div
              className="mb-3 overflow-hidden rounded-2xl"
              style={{
                boxShadow: "0 0 0 1px rgba(234,88,12,0.3), 0 0 40px rgba(234,88,12,0.15)",
              }}
            >
<img src="/logo.png" alt="Logo Full Sound Garage" className="h-20 w-auto" style={{ display: "block" }} />

            </div>

<span
  className="mb-3 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
  style={{
    background: "rgba(234,88,12,0.25)",
    border: "1px solid rgba(234,88,12,0.6)",
    color: "#ff7a3d",
  }}
>
              Agendamento online — Pagamento no local
            </span>

<p
  className="max-w-md text-sm sm:text-base mb-4"
  style={{ color: "rgba(255,255,255,0.92)", lineHeight: 1.6 }}
>
              Escolha o serviço, veja os dias e horários disponíveis e garanta sua vaga na garagem.
            </p>

            <Link
              to="/agendar"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-200"
              style={{
                background: "#ea580c",
                color: "#fff",
                boxShadow: "0 0 25px rgba(234,88,12,0.5)",
              }}
            >
              Agendar agora
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {[
                { icon: <Wallet className="h-3 w-3" />, label: "Pagamento no local" },
                { icon: <Clock className="h-3 w-3" />, label: "Seg a sáb, 8h–18h" },
                { icon: <MapPin className="h-3 w-3" />, label: "Com hora marcada" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-1 text-[11px]"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  <span style={{ color: "#ea580c" }}>{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </HeroScrub>

        {/* SERVIÇOS */}
        <section
          className="relative px-4 py-20"
          style={{
            background: "linear-gradient(to bottom, #0a0a0a 0%, #111111 100%)",
          }}
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#ea580c" }}
                >
                  O que fazemos
                </p>
                <h2
                  className="text-3xl font-extrabold uppercase"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Serviços
                </h2>
              </div>
              <Link
                to="/agendar"
                className="hidden text-xs font-semibold uppercase tracking-widest underline underline-offset-4 sm:block"
                style={{ color: "#ea580c" }}
              >
                Ver disponibilidade →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <article
                  key={s.id}
                  className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.border =
                      "1px solid rgba(234,88,12,0.4)";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(234,88,12,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.border =
                      "1px solid rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.03)";
                  }}
                >
                  <div
                    className="mb-4 inline-flex items-center justify-center rounded-xl p-2.5"
                    style={{
                      background: "rgba(234,88,12,0.1)",
                      color: "#ea580c",
                    }}
                  >
                    {SERVICE_ICONS[s.id]}
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold">{s.name}</h3>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        background: "rgba(234,88,12,0.1)",
                        color: "#ea580c",
                        border: "1px solid rgba(234,88,12,0.2)",
                      }}
                    >
                      {s.duration}
                    </span>
                  </div>

                  <p
                    className="mt-1.5 text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {s.description}
                  </p>

                  <Link
                    to="/agendar"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "#ea580c" }}
                  >
                    Agendar
                    <ChevronRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </Link>

                  <div
                    className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full"
                    aria-hidden
                  />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="px-4 py-20"
          style={{
            background: "#111111",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="mx-auto max-w-5xl">
            <p
              className="mb-1 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#ea580c" }}
            >
              Simples assim
            </p>
            <h2
              className="mb-12 text-3xl font-extrabold uppercase"
              style={{ letterSpacing: "-0.02em" }}
            >
              Como funciona
            </h2>

            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  n: "1",
                  title: "Escolha o serviço",
                  desc: "Selecione entre insulfilme, envelopamento, som ou LEDs.",
                },
                {
                  n: "2",
                  title: "Informe o veículo",
                  desc: "Marca, modelo, ano e dados de contato. Simples e rápido.",
                },
                {
                  n: "3",
                  title: "Confirme o horário",
                  desc: "Escolha o dia e hora. Pagamento somente no local, na entrega.",
                },
              ].map((step) => (
                <div key={step.n} className="flex flex-col gap-3">
                  <span
                    className="w-fit rounded-full px-3 py-1 text-sm font-black"
                    style={{
                      background: "rgba(234,88,12,0.12)",
                      color: "#ea580c",
                      border: "1px solid rgba(234,88,12,0.25)",
                    }}
                  >
                    {step.n}
                  </span>
                  <h3 className="text-base font-bold">{step.title}</h3>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                to="/agendar"
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-widest transition-all duration-200"
                style={{
                  background: "transparent",
                  color: "#ea580c",
                  border: "2px solid #ea580c",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#ea580c";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#ea580c";
                }}
              >
                Quero agendar
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            background: "#0a0a0a",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
          className="pt-10 pb-4"
        >
          <div className="mx-auto flex max-w-4xl flex-row flex-wrap justify-between gap-8 px-6 mb-8">
            <div className="flex flex-col gap-2">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
                style={{ color: "#ea580c" }}
              >
                Redes Sociais
              </p>
              <a
                href="https://www.instagram.com/fullsound_garage/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <Instagram className="h-3.5 w-3.5" />
                @fullsoundgarage
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
                style={{ color: "#ea580c" }}
              >
                Horários
              </p>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                <Clock className="h-3.5 w-3.5" />
                Seg – Sáb: 8h às 18h
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                Domingos: fechado
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
                style={{ color: "#ea580c" }}
              >
                Localização
              </p>
              <a
                href="https://maps.google.com/?q=Rua+Emilio+de+Menezes+747,+Praia+Grande,+SP"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-1.5 text-xs transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>Rua Emílio de Menezes, 747<br />Praia Grande, SP</span>
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4" style={{ opacity: 0.12 }}>
            <div className="h-px w-16" style={{ background: "#ea580c" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ea580c" }} />
            <div className="h-px w-16" style={{ background: "#ea580c" }} />
          </div>

          <div className="flex flex-col items-center gap-2 text-center pb-2 px-4">
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.18)" }}>
              © {new Date().getFullYear()} Full Sound Garage — Todos os direitos reservados
            </p>
            <div className="flex gap-4">
              <Link
                to="/privacidade"
                className="text-[10px] transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.22)" }}
              >
                Política de Privacidade
              </Link>
              <Link
                to="/termos"
                className="text-[10px] transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.22)" }}
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}