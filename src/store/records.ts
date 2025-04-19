import { atom } from "jotai";

// Timer record interface
export interface PomodoroRecord {
	id: string;
	startTime: string; // ISO string
	endTime: string; // ISO string
	completed: boolean;
	sessionNumber: number;
}

// Records atom
export const recordsAtom = atom<PomodoroRecord[]>([]);

// Today's completed pomodoros count atom
export const todayCompletedCountAtom = atom<number>((get) => {
	const records = get(recordsAtom);
	const today = new Date().toISOString().split("T")[0];

	return records.filter(
		(record) => record.completed && record.endTime.startsWith(today),
	).length;
});
