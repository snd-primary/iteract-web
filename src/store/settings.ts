import { atom } from "jotai";

// Settings interface
export interface PomodoroSettings {
  workTime: number; // in minutes
  shortBreakTime: number; // in minutes
  longBreakTime: number; // in minutes
  longBreakInterval: number; // number of work sessions before long break
  autoStartBreak: boolean; // automatically start break after work session
  autoStartWork: boolean; // automatically start work after break
}

// Default settings
export const defaultSettings: PomodoroSettings = {
  workTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
  autoStartBreak: false,
  autoStartWork: false,
};

// Settings atom
export const settingsAtom = atom<PomodoroSettings>(defaultSettings);
