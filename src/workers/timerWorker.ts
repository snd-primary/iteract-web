// src/workers/timerWorker.ts

// メッセージ型に対応したペイロード型の定義
type TickPayload = {
	timeRemaining: number;
};

type ErrorPayload = {
	message: string;
	code?: number;
};

// Workerからメインスレッドへのメッセージ型定義
type WorkerToMainMessage =
	| { type: "TICK"; payload: TickPayload }
	| { type: "COMPLETE"; payload?: undefined }
	| { type: "ERROR"; payload: ErrorPayload };

// メインスレッドからWorkerへのメッセージ型定義
type MainToWorkerMessage =
	| { type: "START"; payload: { duration: number } }
	| { type: "PAUSE"; payload?: undefined }
	| { type: "RESUME"; payload?: undefined }
	| { type: "RESET"; payload?: undefined };

// Worker内部の状態
let interval: number | null = null;
let timeRemaining = 0;
let isRunning = false;

// メインスレッドからのメッセージハンドラ
self.onmessage = (event: MessageEvent<MainToWorkerMessage>) => {
	const { type, payload } = event.data;

	switch (type) {
		case "START": {
			// 新しいタイマーを開始
			const { duration } = payload;
			timeRemaining = duration;
			startTimer();
			break;
		}

		case "PAUSE":
			// タイマーを一時停止
			pauseTimer();
			break;

		case "RESUME":
			// 一時停止したタイマーを再開
			startTimer();
			break;

		case "RESET":
			// タイマーをリセット
			resetTimer();
			break;
	}
};

// タイマーを開始する関数
function startTimer() {
	if (isRunning) return;

	isRunning = true;

	// 現在時刻を保存
	let lastTickTime = Date.now();

	// インターバルを設定
	interval = self.setInterval(() => {
		// 実際の経過時間を計算（ブラウザのスロットリングに対応）
		const now = Date.now();
		const elapsedTime = Math.floor((now - lastTickTime) / 1000);
		lastTickTime = now;

		// 1秒以上経過していれば、その分だけ時間を減らす
		if (elapsedTime >= 1) {
			timeRemaining = Math.max(0, timeRemaining - elapsedTime);

			// メインスレッドに残り時間を通知
			postMessage({
				type: "TICK",
				payload: { timeRemaining },
			} as WorkerToMainMessage);

			// タイマーが完了した場合
			if (timeRemaining === 0) {
				resetTimer();
				postMessage({ type: "COMPLETE" } as WorkerToMainMessage);
			}
		}
	}, 500); // 500msごとにチェック（より正確なタイミングのため）
}

// タイマーを一時停止する関数
function pauseTimer() {
	if (!isRunning) return;

	isRunning = false;

	if (interval !== null) {
		self.clearInterval(interval);
		interval = null;
	}
}

// タイマーをリセットする関数
function resetTimer() {
	isRunning = false;
	timeRemaining = 0;

	if (interval !== null) {
		self.clearInterval(interval);
		interval = null;
	}
}
