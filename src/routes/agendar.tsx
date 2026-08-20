import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ChevronLeft, Clock } from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { signInWithGoogle } from "@/lib/auth";
import {
  SERVICES,
  TIME_SLOTS,
  type ServiceId,
  availableDays,
  createBooking,
  formatDate,
  serviceName,
  setBookingStatus,
  toISODate,
  useDayBookings,
} from "@/lib/booking-store";

const CAR_BRANDS = [
  "Fiat","Volkswagen","Chevrolet","Ford","Toyota","Honda","Hyundai",
  "Renault","Jeep","Nissan","Peugeot","Citroën","Mitsubishi","Kia",
  "BMW","Mercedes-Benz","Audi","Volvo","Land Rover","Caoa Chery",
];

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { title: "Agendar serviço — Full Sound Garage" },
      {
        name: "description",
        content:
          "Escolha o serviço, veja os dias e horários disponíveis e reserve seu horário na Full Sound Garage. Pagamento no local.",
      },
      { property: "og:title", content: "Agendar serviço — Full Sound Garage" },
      {
        property: "og:description",
        content: "Insulfilme, envelopamento, som e LEDs. Reserve seu horário em 1 minuto.",
      },
    ],
  }),
  component: AgendarPage,
});

function AgendarPage() {
  const days = useMemo(() => availableDays(14), []);
  const [service, setService] = useState<ServiceId | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "review">("form");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    brand: "",
    model: "",
    year: "",
    notes: "",
  });
  const { takenTimes: taken } = useDayBookings(date ?? "");

const yearNum = parseInt(form.year);
const canSubmit =
  service && date && time && form.name && form.phone &&
  form.brand && form.model &&
  form.year.length === 4 && yearNum >= 2000 && yearNum <= new Date().getFullYear() + 1;

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
}

  if (step === "review" && service && date && time) {
  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      <main className="mx-auto max-w-xl px-4 py-8">
        <button
          type="button"
          onClick={() => setStep("form")}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Editar
        </button>
        <h1 className="mt-3 text-2xl font-bold">Confirmar agendamento</h1>
        <p className="mt-1 text-muted-foreground">Revise os dados antes de enviar.</p>

        <div className="mt-6 space-y-3 rounded-xl border border-border p-5 text-sm">
          <Row label="Serviço" value={serviceName(service)} />
          <Row label="Data" value={formatDate(date)} />
          <Row label="Horário" value={time} />
          <div className="my-2 border-t border-border" />
          <Row label="Nome" value={form.name} />
          <Row label="WhatsApp" value={form.phone} />
          {form.email && <Row label="E-mail" value={form.email} />}
          <div className="my-2 border-t border-border" />
          <Row label="Veículo" value={`${form.brand} ${form.model} ${form.year}`} />
          {form.notes && <Row label="Obs." value={form.notes} />}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          O pagamento é feito no local. A garagem confirmará sua reserva.
        </p>

        <div className="mt-6 flex flex-col gap-3">
<Button
  size="lg"
  className="w-full"
  onClick={async () => {
    const user = await signInWithGoogle();
    if (!user) return;
    const booking = await createBooking({
      service: service!,
      date: date!,
      time: time!,
      customer: { name: form.name, phone: form.phone, email: user.email },
      vehicle: { brand: form.brand, model: form.model, year: form.year },
      notes: form.notes,
    });
    setDone(booking.id);
  }}
>
  Confirmar agendamento
</Button>
          <Button variant="outline" className="w-full" onClick={() => setStep("form")}>
            Voltar e editar
          </Button>
        </div>
      </main>
    </div>
  );
}

if (done) {
  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      <main className="mx-auto max-w-xl px-4 py-12">
        {/* Confirmação */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Agendamento confirmado!</h1>
          <p className="mt-2 text-muted-foreground">
            {serviceName(service!)} · {formatDate(date!)} às {time}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            A garagem vai revisar e marcar como <strong>reserva confirmada</strong>. Pagamento no local.
          </p>
        </div>

<div className="mt-8 flex flex-col gap-3">
  <Button asChild className="w-full">
    <Link to="/meus-agendamentos">Ver meus agendamentos</Link>
  </Button>
  <Button asChild variant="outline" className="w-full">
    <Link to="/">Voltar ao início</Link>
  </Button>
</div>
      </main>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Início
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Agendar serviço</h1>
        <p className="mt-1 text-muted-foreground">
          Pagamento no local. Escolha o serviço, o dia e o horário.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-10">

  <section className="space-y-3">
    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      1. Serviço
    </h2>
    <div className="grid gap-3 sm:grid-cols-2">
      {SERVICES.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => setService(s.id)}
          className={cn(
            "rounded-xl border p-4 text-left transition-colors",
            service === s.id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
          )}
        >
          <p className="font-semibold">{s.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
          <p className="mt-2 text-xs font-medium text-primary">{s.duration}</p>
        </button>
      ))}
    </div>
  </section>

<section>
  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
    2. Dia
  </h2>
  {(() => {
    // agrupa dias por semana (seg–sáb)
    const todayIso = toISODate(new Date());
    const weeks: Date[][] = [];
    days.forEach((d) => {
      // semana começa na segunda (getDay: 0=dom,1=seg...)
      const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay(); // 1–7
      const weekIndex = Math.floor(
        (days.indexOf(d)) / 6
      );
      if (!weeks[weekIndex]) weeks[weekIndex] = [];
      weeks[weekIndex].push(d);
    });
    return weeks.map((week, wi) => (
      <div key={wi} className="mt-3">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Semana {wi + 1}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {week.map((d) => {
            const iso = toISODate(d);
const full = false; 
const remaining = TIME_SLOTS.length;
            const isToday = iso === todayIso;
            return (
              <button
                key={iso}
                type="button"
                disabled={full}
                onClick={() => { setDate(iso); setTime(null); }}
                className={cn(
                  "min-w-[76px] shrink-0 rounded-lg border px-3 py-2 text-center text-sm transition-colors disabled:opacity-40",
                  date === iso
                    ? "border-primary bg-primary text-primary-foreground"
                    : isToday
                    ? "border-orange-400/60 bg-orange-500/10 hover:border-primary/50"
                    : "border-border hover:border-primary/50",
                )}
              >
                <span className="block text-xs uppercase">
                  {d.toLocaleDateString("pt-BR", { weekday: "short" })}
                </span>
                <span className="block text-lg font-bold">{d.getDate()}</span>
                <span className="block text-[10px] uppercase">
                  {d.toLocaleDateString("pt-BR", { month: "short" })}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-[9px] font-semibold",
                    full
                      ? "text-muted-foreground/50"
                      : remaining <= 2
                      ? "text-orange-400"
                      : date === iso
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground/60",
                  )}
                >
                  {full ? "lotado" : `${remaining} vaga${remaining !== 1 ? "s" : ""}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    ));
  })()}
</section>
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              3. Horário
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {TIME_SLOTS.map((t) => {
                const disabled = !date || taken.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={disabled}
                    onClick={() => setTime(t)}
                    className={cn(
                      "rounded-md border px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                      time === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            {!date && <p className="mt-2 text-xs text-muted-foreground">Escolha um dia primeiro.</p>}
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              4. Seus dados e o veículo
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="WhatsApp" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
<div className="space-y-2">
  <Label htmlFor="marca">Marca do carro</Label>
  <Input
    id="marca"
    list="brands-list"
    value={form.brand}
    required
    onChange={(e) => setForm({ ...form, brand: e.target.value })}
    placeholder="Ex.: Fiat"
  />
  <datalist id="brands-list">
    {CAR_BRANDS.map((b) => <option key={b} value={b} />)}
  </datalist>
</div>
<Field label="Modelo" value={form.model} onChange={(v) => setForm({ ...form, model: v })} />
              <div className="space-y-2">
  <Label htmlFor="ano">Ano</Label>
  <Input
    id="ano"
    value={form.year}
    required
    maxLength={4}
    placeholder="Ex.: 2015"
    onChange={(e) => {
      const v = e.target.value.replace(/\D/g, "").slice(0, 4);
      setForm({ ...form, year: v });
    }}
  />
</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Ex.: película com grau mais escuro nas portas traseiras"
              />
            </div>
          </section>

          <div className="sticky bottom-0 -mx-4 border-t border-border bg-background/95 px-4 py-4 backdrop-blur">
<Button
  type="button"
  size="lg"
  className="w-full"
  disabled={!canSubmit}
  onClick={() => { if (canSubmit) setStep("review"); }}
>
  Revisar agendamento
</Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
Pagamento no local. Confirme seus dados antes de enviar.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/[^a-z]/g, "");
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} required={required} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}