import { atom } from "jotai"; // todayCompletedCountAtom で atom を使っているので残します
import { atomWithStorage, createJSONStorage } from "jotai/utils"; // これらを使います

// Timer record interface
export interface PomodoroRecord {
	id: string;
	startTime: string; // ISO string
	endTime: string; // ISO string
	completed: boolean;
	sessionNumber: number;
}

// localStorage と連携するための設定 (先ほどのsettings.tsファイルなどと共通化しても良いです)
const storage = createJSONStorage<PomodoroRecord[]>(() => localStorage);

// Records atom を atomWithStorage を使って定義します
// これで localStorage と同期されるようになります
export const recordsAtom = atomWithStorage<PomodoroRecord[]>(
	"pomodoro-records", // 1. localStorageに保存する時のキー名
	[], // 2. 初期値 (最初は空の記録)
	storage, // 3. ストレージ設定
);

export const todayCompletedCountAtom = atom<number>((get) => {
	const records = get(recordsAtom);
	const today = new Date().toISOString().split("T")[0]; // 今日の日付 (例: "2025-05-10")

	return records.filter(
		(record) => record.completed && record.endTime.startsWith(today),
	).length;
});
