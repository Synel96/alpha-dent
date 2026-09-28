import React from "react";
import { clinicNow, getOpenStatus, type OpenStatus } from "./opening-hours";

// Pages are prerendered, so the build-time clock must never reach the HTML:
// both values stay null through SSR and hydration and are filled in on mount.
export function useOpenStatus(): { status: OpenStatus | null; todayWeekday: number | null } {
  const [state, setState] = React.useState<{
    status: OpenStatus | null;
    todayWeekday: number | null;
  }>({ status: null, todayWeekday: null });

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setState({ status: getOpenStatus(now), todayWeekday: clinicNow(now).weekday });
    };
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return state;
}
