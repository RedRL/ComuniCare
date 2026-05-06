import { useCallback, useEffect, useState } from "react";
import type { BabyProfile } from "../models/types";
import { storage } from "../services/storageService";

export function useBabyProfile() {
  const [profile, setProfileState] = useState<BabyProfile | null>(() =>
    storage.getProfile()
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "tinysignals.babyProfile") {
        setProfileState(storage.getProfile());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setProfile = useCallback((next: BabyProfile | null) => {
    storage.setProfile(next);
    setProfileState(next);
  }, []);

  const clearProfile = useCallback(() => {
    storage.setProfile(null);
    setProfileState(null);
  }, []);

  return { profile, setProfile, clearProfile };
}
