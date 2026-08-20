import { useSyncExternalStore } from "react";

export type ServiceId = "insulfilme" | "envelopamento" | "som" | "leds";

export type Service = {
  id: ServiceId;
  name: string;
  description: string;
  duration: string;
};

export const SERVICES: Service[] = [
  {
    id: "insulfilme",
    name: "Insulfilme",
    description: "Películas de proteção solar e privacidade, aplicação sem bolhas.",
    duration: "≈ 2h",
  },
  {
    id: "envelopamento",
    name: "Envelopamento",
    description: "Troca de cor, detalhes e proteção da pintura em vinil premium.",
    duration: "1 a 2 dias",
  },
  {
    id: "som",
    name: "Som",
    description: "Instalação de multimídia, alto-falantes, módulos e caixas.",
    duration: "≈ 3h",
  },
  {
    id: "leds",
    name: "LEDs",
    description: "Faróis, barras, iluminação interna e sinalização em LED.",
    duration: "≈ 1h30",
  },
];

export const TIME_SLOTS = ["08:00", "09:30", "11:00", "13:30", "15:00", "16:30"];

export type BookingStatus = "pendente" | "confirmada" | "cancelada" | "concluida";

export type Booking = {
  id: string;
  createdAt: string;
  service: ServiceId;
  date: string; // yyyy-mm-dd
  time: string;
  status: BookingStatus;
  customer: { name: string; phone: string; email: string };
  vehicle: { brand: string; model: string; year: string; plate?: string };
  notes?: string;
};

const KEY = "fsg.bookings.v1";

let cache: Booking[] | null = null;
const listeners = new Set<() => void>();

function read(): Booking[] {
  if (typeof window === "undefined") return [];
  if (cache) return cache;
  try {
    cache = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Booking[];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: Booking[]) {
  cache = next;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useBookings(): Booking[] {
  return useSyncExternalStore(subscribe, read, () => [] as Booking[]);
}

export function createBooking(input: Omit<Booking, "id" | "createdAt" | "status">): Booking {
  const booking: Booking = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pendente",
  };
  write([...read(), booking]);
  return booking;
}

export function setBookingStatus(id: string, status: BookingStatus) {
  write(read().map((b) => (b.id === id ? { ...b, status } : b)));
}

export function deleteBooking(id: string) {
  write(read().filter((b) => b.id !== id));
}

/** Dias úteis disponíveis (seg–sáb) a partir de amanhã. */
export function availableDays(count = 14): Date[] {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    if (cursor.getDay() !== 0) days.push(new Date(cursor));
  }
  return days;
}

export function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDate(iso: string) {
  const parts = iso.split("-").map(Number);
  return new Date(parts[0] ?? 2026, (parts[1] ?? 1) - 1, parts[2] ?? 1).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export function serviceName(id: ServiceId) {
  return SERVICES.find((s) => s.id === id)?.name ?? id;
}

export function takenSlots(bookings: Booking[], date: string) {
  return bookings.filter((b) => b.date === date && b.status !== "cancelada").map((b) => b.time);
}