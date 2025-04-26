export type TickPayload = {
	timeRemaining: number;
};

export type ErrorPayload = {
	message: string;
	code?: number;
};

// Workerからメインスレッドへのメッセージ型定義
export type WorkerToMainMessage =
	| { type: "TICK"; payload: TickPayload }
	| { type: "COMPLETE"; payload?: undefined }
	| { type: "ERROR"; payload: ErrorPayload };

// メインスレッドからWorkerへのメッセージ型定義
export type MainToWorkerMessage =
	| { type: "START"; payload: { duration: number } }
	| { type: "PAUSE"; payload?: undefined }
	| { type: "RESUME"; payload?: undefined }
	| { type: "RESET"; payload?: undefined };
