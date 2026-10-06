// Weekly schedule in clinic-local (Europe/Budapest) minutes since midnight,
// indexed Monday = 0 ... Sunday = 6. null = closed all day.
export const WEEKLY_HOURS: readonly (readonly [open: number, close: number] | null)[] = [
  [8 * 60, 17 * 60],
  [8 * 60, 17 * 60],
  [8 * 60, 17 * 60],
  [8 * 60, 17 * 60],
  [8 * 60, 17 * 60],
  null,
  null,
];

const CLINIC_TIME_ZONE = "Europe/Budapest";
const WEEKDAY_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

export type OpenStatus =
  | { open: true; closesAt: number }
  | { open: false; opensAt: number; weekday: number; daysUntil: number };

// Visitors abroad must see the clinic's status, not one based on their own clock.
export function clinicNow(date: Date): { weekday: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CLINIC_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return {
    weekday: WEEKDAY_INDEX[get("weekday")],
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function getOpenStatus(date: Date): OpenStatus {
  const { weekday, minutes } = clinicNow(date);
  const today = WEEKLY_HOURS[weekday];

  if (today && minutes >= today[0] && minutes < today[1]) {
    return { open: true, closesAt: today[1] };
  }
  if (today && minutes < today[0]) {
    return { open: false, opensAt: today[0], weekday, daysUntil: 0 };
  }
  for (let daysUntil = 1; daysUntil <= 7; daysUntil++) {
    const nextWeekday = (weekday + daysUntil) % 7;
    const hours = WEEKLY_HOURS[nextWeekday];
    if (hours) return { open: false, opensAt: hours[0], weekday: nextWeekday, daysUntil };
  }
  throw new Error("WEEKLY_HOURS has no open day");
}

export function formatClockTime(minutes: number): string {
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;
}

// 2024-01-01 was a Monday, so adding the Monday-based index lands on that weekday.
export function weekdayName(weekday: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(2024, 0, 1 + weekday))
  );
}
