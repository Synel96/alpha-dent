import { describe, it, expect } from "vitest";
import { formatClockTime, getOpenStatus, weekdayName } from "../../lib/opening-hours";

// September dates are CEST (UTC+2), December dates are CET (UTC+1).
describe("getOpenStatus (budapesti idő szerint)", () => {
  it("hétköznap nyitvatartási időben nyitva van, 17:00-ig", () => {
    expect(getOpenStatus(new Date("2026-09-28T08:00:00Z"))).toEqual({ open: true, closesAt: 17 * 60 });
  });

  it("nyitás előtt zárva, és ma 8:00-kor nyit", () => {
    // 05:59 UTC = 07:59 CEST
    expect(getOpenStatus(new Date("2026-09-28T05:59:00Z"))).toEqual({
      open: false,
      opensAt: 8 * 60,
      weekday: 0,
      daysUntil: 0,
    });
  });

  it("pontban 17:00-kor már zárva, és holnap nyit", () => {
    expect(getOpenStatus(new Date("2026-09-28T15:00:00Z"))).toMatchObject({
      open: false,
      weekday: 1,
      daysUntil: 1,
    });
  });

  it("péntek este zárva, és hétfőn nyit", () => {
    expect(getOpenStatus(new Date("2026-10-02T16:30:00Z"))).toMatchObject({
      open: false,
      weekday: 0,
      daysUntil: 3,
    });
  });

  it("szombaton zárva, és hétfőn nyit", () => {
    expect(getOpenStatus(new Date("2026-10-03T10:00:00Z"))).toMatchObject({
      open: false,
      weekday: 0,
      daysUntil: 2,
    });
  });

  it("pontban 8:00-kor már nyitva", () => {
    // 06:00 UTC = 08:00 CEST
    expect(getOpenStatus(new Date("2026-09-28T06:00:00Z")).open).toBe(true);
  });

  it("téli időszámításban is a budapesti órát nézi", () => {
    // 07:30 UTC = 08:30 CET on a Monday
    expect(getOpenStatus(new Date("2026-12-07T07:30:00Z")).open).toBe(true);
    // 06:30 UTC = 07:30 CET, before opening
    expect(getOpenStatus(new Date("2026-12-07T06:30:00Z")).open).toBe(false);
  });
});

describe("formázó segédfüggvények", () => {
  it("az időt óra:perc formában adja vissza", () => {
    expect(formatClockTime(9 * 60)).toBe("9:00");
    expect(formatClockTime(17 * 60 + 5)).toBe("17:05");
  });

  it("a nap nevét a megadott nyelven adja vissza", () => {
    expect(weekdayName(0, "hu")).toBe("hétfő");
    expect(weekdayName(4, "en")).toBe("Friday");
    expect(weekdayName(6, "de")).toBe("Sonntag");
  });
});
