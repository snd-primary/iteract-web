import { atom } from "jotai";

// Theme type
export type ThemeMode = "light" | "dark";

// Theme atom
export const themeAtom = atom<ThemeMode>("light");
