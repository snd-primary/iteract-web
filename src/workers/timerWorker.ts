import type {
	MainToWorkerMessage,
	WorkerToMainMessage,
} from "@/types/workerMessages";

// --- Worker内部の状態 ---
let interval: number | null = null;
let targetEndTime = 0; // タイマーの目標終了時刻 (ミリ秒)
let lastReportedTime = -1; // 最後に通知した残り時間（秒）重複通知を防ぐため
let timeRemainingOnPause = 0; // 一時停止時の残り時間（ミリ秒）
let isRunning = false;
let initialDuration = 0; // リセット用に初期時間を保持

// --- メインスレッドからのメッセージハンドラ ---
self.onmessage = (event: MessageEvent<MainToWorkerMessage>) => {
	const { type, payload } = event.data;

	switch (type) {
		case "START": {
			const { duration } = payload;
			cleanupTimer(); // 既存のタイマーがあればクリア
			initialDuration = duration;

			//タイマーが終了するべき正確な時刻を、ミリ秒単位のタイムスタンプとして設定する
			const now = Date.now(); //現在時刻から指定されたミリ秒後の時点を計算
			targetEndTime = now + duration * 1000;
			lastReportedTime = duration; // 初期値をセット

			postMessage({
				type: "TICK",
				payload: { timeRemaining: duration },
			} as WorkerToMainMessage); // 開始時に最初のTICKを送信
			startTimer();
			break;
		}

		case "PAUSE":
			pauseTimer();
			break;
		case "RESUME":
			// isRunningでなく、interval === null で判定する方が確実な場合もある
			if (!isRunning && targetEndTime > 0 && timeRemainingOnPause > 0) {
				// 停止していた時間分、終了目標時刻を未来にずらすのではなく、
				// 残り時間を使って新しい終了目標時刻を計算する
				targetEndTime = Date.now() + timeRemainingOnPause;
				timeRemainingOnPause = 0; // リセット
				startTimer(); // タイマー再開
			}
			break;
		case "RESET":
			resetTimer();
			break;
	}
};

// --- タイマー制御関数 ---

function startTimer() {
	if (isRunning || targetEndTime <= Date.now()) {
		return; // 既に実行中か、既に終了時刻を過ぎていたら何もしない
	}

	isRunning = true;
	console.log("StartTimer: Starting interval...");

	interval = self.setInterval(() => {
		const now = Date.now();
		const remainingMilliseconds = Math.max(0, targetEndTime - now);
		const remainingSeconds = Math.round(remainingMilliseconds / 1000);

		// 残り時間（秒）が変わった場合のみTICKメッセージを送信
		if (remainingSeconds !== lastReportedTime) {
			lastReportedTime = remainingSeconds;
			postMessage({
				type: "TICK",
				payload: { timeRemaining: remainingSeconds },
			} as WorkerToMainMessage);
		}

		// タイマーが完了した場合
		if (remainingMilliseconds === 0) {
			postMessage({ type: "COMPLETE" } as WorkerToMainMessage);
			cleanupTimer(); // タイマー完了後にクリーンアップ
		}
	}, 200); // 200msごとにチェック（より頻繁にチェックして精度を上げる）
}

function pauseTimer() {
	if (!isRunning || interval === null) {
		return; // 実行中でなければ何もしない
	}

	// ポーズする前に現在の残り時間を計算して保存
	const now = Date.now();
	timeRemainingOnPause = Math.max(0, targetEndTime - now);

	cleanupTimer(); // isRunning = false もここに含まれる
}

function resetTimer() {
	cleanupTimer();
	targetEndTime = 0;
	timeRemainingOnPause = 0;
	lastReportedTime = initialDuration; // リセット時は初期値に戻す
	// リセット時にTICKを送る (初期値に戻ったことを通知)
	/* 	postMessage({
		type: "TICK",
		payload: { timeRemaining: initialDuration },
	} as WorkerToMainMessage); */
}

// インターバルをクリアし、実行中フラグをリセットする共通関数
function cleanupTimer() {
	if (interval !== null) {
		self.clearInterval(interval);
		interval = null;
	}
	isRunning = false;
}
