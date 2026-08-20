import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Wallet } from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/booking-store";
import logo from "@/assets/logo.jpg.asset.json";

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

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />

      <main>
        <section className="border-b border-border bg-accent/40">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-14 text-center">
            <img src={logo.url} alt="Logo Full Sound Garage" className="h-28 w-auto" />
            <h1 className="max-w-2xl text-4xl font-extrabold uppercase leading-tight tracking-tight">
              Seu carro com <span className="text-primary">som, brilho e estilo</span>
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Escolha o serviço, veja os dias e horários disponíveis e garanta sua vaga na garagem.
            </p>
            <Button asChild size="lg">
              <Link to="/agendar">Agendar agora</Link>
            </Button>
            <div className="mt-2 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" /> Pagamento no local
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Seg a sáb, 8h às 18h
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Atendimento com hora marcada
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-2xl font-bold">Serviços</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <article key={s.id} className="rounded-lg border border-border p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                  <span className="text-xs text-muted-foreground">{s.duration}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                <Button asChild variant="link" className="mt-2 px-0">
                  <Link to="/agendar">Agendar {s.name}</Link>
                </Button>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-border bg-ink py-8 text-center text-sm text-ink-foreground">
          Full Sound Garage · Agendamentos online · Pagamento no local
        </footer>
      </main>
    </div>
  );
}
