import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

// ── Tipos ──────────────────────────────────────────────────────────────────

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

//documento salvo no Firestore (sem o id, que vem do doc.id)
type BookingDoc = Omit<Booking, "id">;

const COL = "bookings";

// Hooks de leitura

/** Agendamentos do cliente logado, ordenados por data/hora. */
export function useMyBookings(email: string): { bookings: Booking[]; loading: boolean } {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, COL),
      where("customer.email", "==", email),
      orderBy("date"),
      orderBy("time"),
    );

    const unsub = onSnapshot(q, (snap) => {
      setBookings(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as BookingDoc) })),
      );
      setLoading(false);
    });

    return unsub;
  }, [email]);

  return { bookings, loading };
}

/**todos os agendamentos — exclusivo para o painel admin. */
export function useAllBookings(): { bookings: Booking[]; loading: boolean } {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, COL),
      orderBy("date"),
      orderBy("time"),
    );

    const unsub = onSnapshot(q, (snap) => {
      setBookings(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as BookingDoc) })),
      );
      setLoading(false);
    });

    return unsub;
  }, []);

  return { bookings, loading };
}

export function useDayBookings(date: string): { takenTimes: string[]; loading: boolean } {
  const [takenTimes, setTakenTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date) {
      setTakenTimes([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, COL),
      where("date", "==", date),
      where("status", "!=", "cancelada"),
    );

    const unsub = onSnapshot(q, (snap) => {
      setTakenTimes(snap.docs.map((d) => (d.data() as BookingDoc).time));
      setLoading(false);
    });

    return unsub;
  }, [date]);

  return { takenTimes, loading };
}

// Ações

export async function createBooking(
  input: Omit<Booking, "id" | "createdAt" | "status">,
): Promise<Booking> {
  const data: BookingDoc = {
    ...input,
    createdAt: new Date().toISOString(),
    status: "pendente",
  };
  const ref = await addDoc(collection(db, COL), data);
  return { id: ref.id, ...data };
}

export async function setBookingStatus(id: string, status: BookingStatus): Promise<void> {
  await updateDoc(doc(db, COL, id), { status });
}

export async function deleteBooking(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

// Helpers puros (sem mudança)

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
  return new Date(
    parts[0] ?? 2026,
    (parts[1] ?? 1) - 1,
    parts[2] ?? 1,
  ).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export function serviceName(id: ServiceId) {
  return SERVICES.find((s) => s.id === id)?.name ?? id;
}

/** Mantido para compatibilidade — recebe lista e data, retorna times ocupados. */
export function takenSlots(bookings: Booking[], date: string): string[] {
  return bookings
    .filter((b) => b.date === date && b.status !== "cancelada")
    .map((b) => b.time);
}