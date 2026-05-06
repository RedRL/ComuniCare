import { useMemo } from "react";
import type { BabyProfile } from "../models/types";

export interface BabyAge {
  totalMonths: number;
  totalDays: number;
  display: string;
}

export function useBabyAge(profile: BabyProfile | null): BabyAge | null {
  return useMemo(() => {
    if (!profile?.birthDate) return null;
    const birth = new Date(profile.birthDate);
    if (Number.isNaN(birth.getTime())) return null;
    const now = new Date();
    const ms = now.getTime() - birth.getTime();
    const totalDays = Math.max(0, Math.floor(ms / 86400000));
    const totalMonths = Math.max(0, ms / (1000 * 60 * 60 * 24 * 30.4375));

    let display: string;
    if (totalDays < 14) {
      display = `${totalDays} day${totalDays === 1 ? "" : "s"} old`;
    } else if (totalDays < 90) {
      const w = Math.floor(totalDays / 7);
      display = `${w} week${w === 1 ? "" : "s"} old`;
    } else {
      const m = Math.floor(totalMonths);
      display = `${m} month${m === 1 ? "" : "s"} old`;
    }
    return { totalDays, totalMonths, display };
  }, [profile?.birthDate]);
}
