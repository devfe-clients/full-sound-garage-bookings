import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, CalendarDays, Clock, RotateCcw, X } from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";
import { useCurrentUser, signInWithGoogle, authEnabled } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TIME_SLOTS,
  availableDays,
  formatDate,
  serviceName,
  setBookingStatus,
  takenSlots,
  toISODate,
  useMyBookings,
  useDayBookings,
  createBooking,
  type Booking,
  type BookingStatus,
  useAllBookings,
} from "@/lib/booking-store";

export const Route = createFileRoute("/meus-agendamentos")({
  head: () => ({
    meta: [
      { title: "Meus agendamentos — Full Sound Garage" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MeusAgendamentosPage,
});

const statusStyle: Record<BookingStatus, string> = {
  pendente:   "bg-muted text-muted-foreground",
  confirmada: "bg-primary text-primary-foreground",
  cancelada:  "bg-destructive/20 text-destructive",
  concluida:  "bg-green-600/20 text-green-700 dark:text-green-400",
};

const statusLabel: Record<BookingStatus, string> = {
  pendente:   "Pendente",
  confirmada: "Confirmada",
  cancelada:  "Cancelada",
  concluida:  "Concluída",
};

function ReschedulePanel({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const days = availableDays(14);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const { takenTimes: taken } = useDayBookings(date ?? "");
  const { bookings: allBookings } = useAllBookings(); 
  const todayIso = toISODate(new Date());

async function confirm() {
  if (!date || !time) return;
  await setBookingStatus(booking.id, "cancelada");
  await createBooking({
    service:  booking.service,
    date,
    time,
    customer: booking.customer,
    vehicle:  booking.vehicle,
    notes:    booking.notes ?? "",
  });
  onClose();
}

  return (
    <div className="mt-4 rounded-xl border border-primary/40 bg-accent/50 p-4 space-y-4">
      <p className="text-sm font-semibold">Escolha nova data e horário</p>

      {/* Dias */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => {
          const iso = toISODate(d);
 const dayTaken = takenSlots(allBookings, iso); 
const rem = TIME_SLOTS.length - dayTaken.length;
          const full = rem === 0;
          const isToday = iso === todayIso;
          return (
            <button
              key={iso}
              type="button"
              disabled={full}
              onClick={() => { setDate(iso); setTime(null); }}
              className={cn(
                "min-w-[68px] shrink-0 rounded-lg border px-2 py-1.5 text-center text-xs transition-colors disabled:opacity-40",
                date === iso
                  ? "border-primary bg-primary text-primary-foreground"
                  : isToday
                  ? "border-orange-400/60 bg-orange-500/10 hover:border-primary/50"
                  : "border-border hover:border-primary/50",
              )}
            >
              <span className="block uppercase">{d.toLocaleDateString("pt-BR", { weekday: "short" })}</span>
              <span className="block text-base font-bold">{d.getDate()}</span>
              <span className="block uppercase text-[9px]">{d.toLocaleDateString("pt-BR", { month: "short" })}</span>
              <span className={cn(
                "block text-[9px] font-semibold mt-0.5",
                full ? "text-muted-foreground/50" : rem <= 2 ? "text-orange-400" : "text-muted-foreground/60"
              )}>
                {full ? "lotado" : `${rem} vaga${rem !== 1 ? "s" : ""}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Horários */}
      {date && (
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((t) => {
            const disabled = taken.includes(t);
            return (
              <button
                key={t}
                type="button"
                disabled={disabled}
                onClick={() => setTime(t)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs transition-colors disabled:opacity-40",
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
      )}

      <div className="flex gap-2 pt-1">
        <Button size="sm" disabled={!date || !time} onClick={confirm}>
          Confirmar reagendamento
        </Button>
        <Button size="sm" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}

function MeusAgendamentosPage() {
  const user = useCurrentUser();
  const { bookings, loading } = useMyBookings(user?.email ?? "");
  const [rescheduling, setRescheduling] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <BrandHeader />
        <main className="mx-auto max-w-2xl px-4 py-8">
          <p className="text-muted-foreground">Carregando agendamentos...</p>
        </main>
      </div>
    );
  }

  const ativos = bookings
    .filter((b) => b.status === "pendente" || b.status === "confirmada")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const historico = bookings
    .filter((b) => b.status === "cancelada" || b.status === "concluida")
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)); // mais recente primeiro

  if (authEnabled && !user) {
    return (
      <div className="min-h-screen bg-background">
        <BrandHeader />
        <main className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Área do cliente</h1>
          <p className="mt-2 text-muted-foreground">
            Faça login com sua conta Google para ver seus agendamentos.
          </p>
          <Button
            className="mt-8 w-full gap-2"
            onClick={() => void signInWithGoogle()}
          >
            Entrar com Google
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Início
        </Link>

<div className="mt-3 flex items-start justify-between gap-4 flex-wrap">
  <div>
    <h1 className="text-3xl font-bold tracking-tight">Meus agendamentos</h1>
    <p className="mt-1 text-muted-foreground">
      {user ? `Olá, ${user.name.split(" ")[0]}. ` : ""}Acompanhe, reagende ou cancele seus horários.
    </p>
  </div>
</div>

        {/* ── Ativos ── */}
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> Próximos
          </h2>

          {ativos.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Nenhum agendamento ativo.{" "}
              <Link to="/agendar" className="text-primary underline underline-offset-4">
                Agendar agora
              </Link>
            </div>
          )}

          <div className="space-y-3">
            {ativos.map((b) => (
              <article key={b.id} className="rounded-xl border border-border p-4 space-y-1">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{serviceName(b.service)}</h3>
                      <Badge className={statusStyle[b.status]}>{statusLabel[b.status]}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(b.date)} às {b.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {b.vehicle.brand} {b.vehicle.model} {b.vehicle.year}
                    </p>
                    {b.notes && (
                      <p className="mt-1 text-xs italic text-muted-foreground">"{b.notes}"</p>
                    )}
                  </div>

                  {/* Ações — só para pendente e confirmada */}
                  <div className="flex gap-2 shrink-0">
                    {b.status === "pendente" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() =>
                          setRescheduling(rescheduling === b.id ? null : b.id)
                        }
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reagendar
                      </Button>
                    )}
                    {(b.status === "pendente" || b.status === "confirmada") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive border-destructive/40 hover:bg-destructive/10"
onClick={() => {
  if (window.confirm("Cancelar este agendamento?")) {
    void setBookingStatus(b.id, "cancelada");
  }
}}
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>

                {/* Painel de reagendamento inline */}
                {rescheduling === b.id && (
                  <ReschedulePanel
                    booking={b}
                    onClose={() => setRescheduling(null)}
                  />
                )}
              </article>
            ))}
          </div>
        </section>

        {/* ── Histórico ── */}
        {historico.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Histórico
            </h2>
            <div className="space-y-2">
              {historico.map((b) => (
                <div
                  key={b.id}
                  className="rounded-lg border border-border/50 px-4 py-3 flex items-center justify-between gap-3 opacity-70"
                >
                  <div>
                    <p className="text-sm font-medium">{serviceName(b.service)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(b.date)} às {b.time} · {b.vehicle.brand} {b.vehicle.model}
                    </p>
                  </div>
                  <Badge className={statusStyle[b.status]}>{statusLabel[b.status]}</Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10">
          <Button asChild className="w-full">
            <Link to="/agendar">+ Novo agendamento</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}