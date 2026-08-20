import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ChevronLeft, Clock } from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { authEnabled, signInWithGoogle } from "@/lib/auth";
import {
  SERVICES,
  TIME_SLOTS,
  type ServiceId,
  availableDays,
  createBooking,
  formatDate,
  serviceName,
  takenSlots,
  toISODate,
  useBookings,
} from "@/lib/booking-store";

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
  const bookings = useBookings();
  const days = useMemo(() => availableDays(14), []);
  const [service, setService] = useState<ServiceId | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    brand: "",
    model: "",
    year: "",
    plate: "",
    notes: "",
  });

  const taken = date ? takenSlots(bookings, date) : [];
  const canSubmit =
    service && date && time && form.name && form.phone && form.brand && form.model && form.year;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    void signInWithGoogle(); // ativo somente quando o Firebase estiver configurado
    const booking = createBooking({
      service: service!,
      date: date!,
      time: time!,
      customer: { name: form.name, phone: form.phone, email: form.email },
      vehicle: { brand: form.brand, model: form.model, year: form.year, plate: form.plate },
      notes: form.notes,
    });
    setDone(booking.id);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <BrandHeader />
        <main className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Pedido de agendamento enviado</h1>
          <p className="mt-2 text-muted-foreground">
            {serviceName(service!)} · {formatDate(date!)} às {time}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            A garagem vai revisar e marcar como <strong>reserva confirmada</strong>. O pagamento é
            feito no local.
          </p>
          <Button asChild className="mt-8">
            <Link to="/">Voltar ao início</Link>
          </Button>
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
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              1. Serviço
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setService(s.id)}
                  className={cn(
                    "rounded-lg border p-4 text-left transition-colors",
                    service === s.id
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{s.name}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {s.duration}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              2. Dia
            </h2>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {days.map((d) => {
                const iso = toISODate(d);
                const full = takenSlots(bookings, iso).length >= TIME_SLOTS.length;
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={full}
                    onClick={() => {
                      setDate(iso);
                      setTime(null);
                    }}
                    className={cn(
                      "min-w-[76px] shrink-0 rounded-lg border px-3 py-2 text-center text-sm transition-colors disabled:opacity-40",
                      date === iso
                        ? "border-primary bg-primary text-primary-foreground"
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
                  </button>
                );
              })}
            </div>
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
              <Field label="E-mail (opcional)" required={false} value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Field label="Placa (opcional)" required={false} value={form.plate} onChange={(v) => setForm({ ...form, plate: v })} />
              <Field label="Marca do carro" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
              <Field label="Modelo" value={form.model} onChange={(v) => setForm({ ...form, model: v })} />
              <Field label="Ano" value={form.year} onChange={(v) => setForm({ ...form, year: v })} />
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
            <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
              Agendar
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {authEnabled
                ? "Você entrará com sua conta Google para confirmar."
                : "Login com Google será ativado em breve. Pagamento no local."}
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