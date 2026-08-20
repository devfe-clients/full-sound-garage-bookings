import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Car, CheckCircle2, Trash2, Users, CalendarDays } from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type BookingStatus,
  deleteBooking,
  formatDate,
  serviceName,
  setBookingStatus,
  useBookings,
} from "@/lib/booking-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel de agendamentos — Full Sound Garage" },
      {
        name: "description",
        content: "Controle de agendamentos, veículos e clientes da Full Sound Garage.",
      },
      { property: "og:title", content: "Painel — Full Sound Garage" },
      { property: "og:description", content: "Agenda, veículos e clientes em um só lugar." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const statusStyle: Record<BookingStatus, string> = {
  pendente: "bg-muted text-muted-foreground",
  confirmada: "bg-primary text-primary-foreground",
  cancelada: "bg-ink text-ink-foreground",
  concluida: "bg-success text-primary-foreground",
};

function AdminPage() {
  const bookings = useBookings();
  const [filter, setFilter] = useState<"todos" | BookingStatus>("todos");

  const sorted = useMemo(
    () =>
      [...bookings]
        .filter((b) => filter === "todos" || b.status === filter)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [bookings, filter],
  );

  const clients = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; email: string; count: number }>();
    bookings.forEach((b) => {
      const key = b.customer.phone || b.customer.name;
      const prev = map.get(key);
      map.set(key, { ...b.customer, count: (prev?.count ?? 0) + 1 });
    });
    return [...map.values()];
  }, [bookings]);

  const byDay = useMemo(() => {
    const map = new Map<string, typeof bookings>();
    bookings
      .filter((b) => b.status !== "cancelada")
      .forEach((b) => map.set(b.date, [...(map.get(b.date) ?? []), b]));
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [bookings]);

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight">Painel</h1>
        <p className="mt-1 text-muted-foreground">
          Controle de agendamentos, veículos e clientes.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat icon={CalendarDays} label="Agendamentos" value={bookings.length} />
          <Stat
            icon={CheckCircle2}
            label="Confirmados"
            value={bookings.filter((b) => b.status === "confirmada").length}
          />
          <Stat icon={Users} label="Clientes" value={clients.length} />
        </div>

        <Tabs defaultValue="agenda" className="mt-8">
          <TabsList>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="dias">Dias / veículos</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
          </TabsList>

          <TabsContent value="agenda" className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {(["todos", "pendente", "confirmada", "concluida", "cancelada"] as const).map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={filter === f ? "default" : "outline"}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>

            {sorted.length === 0 && (
              <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Nenhum agendamento por aqui ainda.
              </p>
            )}

            {sorted.map((b) => (
              <article key={b.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{serviceName(b.service)}</h3>
                      <Badge className={statusStyle[b.status]}>{b.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDate(b.date)} · {b.time}
                    </p>
                    <p className="mt-2 text-sm">
                      <strong>{b.customer.name}</strong> — {b.customer.phone}
                      {b.customer.email ? ` · ${b.customer.email}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {b.vehicle.brand} {b.vehicle.model} {b.vehicle.year}
                      {b.vehicle.plate ? ` · ${b.vehicle.plate}` : ""}
                    </p>
                    {b.notes && <p className="mt-2 text-sm italic text-muted-foreground">“{b.notes}”</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {b.status !== "confirmada" && (
                      <Button size="sm" onClick={() => setBookingStatus(b.id, "confirmada")}>
                        Reserva confirmada
                      </Button>
                    )}
                    {b.status === "confirmada" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setBookingStatus(b.id, "concluida")}
                      >
                        Concluir
                      </Button>
                    )}
                    {b.status !== "cancelada" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setBookingStatus(b.id, "cancelada")}
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => deleteBooking(b.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </TabsContent>

          <TabsContent value="dias" className="mt-4 space-y-4">
            {byDay.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum veículo na agenda.</p>
            )}
            {byDay.map(([date, list]) => (
              <div key={date} className="rounded-lg border border-border p-4">
                <h3 className="font-semibold">{formatDate(date)}</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {list.map((b) => (
                    <li key={b.id} className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-primary" />
                      {b.time} — {b.vehicle.brand} {b.vehicle.model} {b.vehicle.year} ·{" "}
                      {serviceName(b.service)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="clientes" className="mt-4 space-y-3">
            {clients.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado.</p>
            )}
            {clients.map((c) => (
              <div
                key={c.phone + c.name}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {c.phone} {c.email ? `· ${c.email}` : ""}
                  </p>
                </div>
                <Badge variant="outline">{c.count} agendamento(s)</Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}