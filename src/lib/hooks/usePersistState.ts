import { useAtom } from "jotai";
import { useEffect } from "react";
import { settingsAtom } from "@/store/settings";
import { themeAtom } from "@/store/theme";
import { recordsAtom } from "@/store/records";

// Hook to persist state to localStorage
export function usePersistState() {
  const [settings] = useAtom(settingsAtom);
  const [theme] = useAtom(themeAtom);
  const [records] = useAtom(recordsAtom);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem("pomodoro-settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, [settings]);

  // Persist theme
  useEffect(() => {
    try {
      localStorage.setItem("pomodoro-theme", theme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  }, [theme]);

  // Persist records
  useEffect(() => {
    try {
      localStorage.setItem("pomodoro-records", JSON.stringify(records));
    } catch (error) {
      console.error("Failed to save records:", error);
    }
  }, [records]);
}
