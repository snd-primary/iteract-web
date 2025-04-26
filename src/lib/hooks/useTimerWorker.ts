import type {
	MainToWorkerMessage,
	WorkerToMainMessage,
} from "@/types/workerMessages";
import { useCallback, useEffect, useRef, useState } from "react";

// WebWorker自体の状態を示す型。※タイマーの状態ではないことに留意
type WorkerStatus = "idle" | "initializing" | "ready" | "error" | "terminated";

//Workerからメッセージが送られてきた時,メイン側で行う処理のための型定義
interface UseTimerWorkerProps {
	onMessage: (event: MessageEvent<WorkerToMainMessage>) => void;
	onError?: (error: Event | string) => void;
}

//メインからWorkerに対して、メッセージを送る時の型
interface UseTimerWorkerReturn {
	postMessage: (message: MainToWorkerMessage) => void;
	workerStatus: WorkerStatus;
}

export const useTimerWorker = ({
	onMessage,
	onError,
}: UseTimerWorkerProps): UseTimerWorkerReturn => {
	const workerRef = useRef<Worker | null>(null);

	const [workerStatus, setWorkerStatus] = useState<WorkerStatus>("idle");

	const onMessageRef = useRef(onMessage);
	const onErrorRef = useRef(onError);

	useEffect(() => {
		onMessageRef.current = onMessage;
	}, [onMessage]);

	useEffect(() => {
		onErrorRef.current = onError;
	}, [onError]);

	// Workerの生成、破棄
	useEffect(() => {
		if (typeof window === "undefined") return;

		setWorkerStatus("initializing");

		let didTerminate = false;

		try {
			const worker = new Worker(
				new URL("../../workers/timerWorker.ts", import.meta.url),
			);
			workerRef.current = worker; // refでWorkerを保持

			//Workerからメインに対して、payloadを送信する処理
			worker.onmessage = (event: MessageEvent<WorkerToMainMessage>) => {
				onMessageRef.current?.(event);
			};

			worker.onerror = (event: Event) => {
				console.error("Worker error event", event);
				onErrorRef.current?.(event);
				setWorkerStatus("error");
			};

			setWorkerStatus("ready");
			console.log("Worker initialized and ready.");
		} catch (error) {
			console.error("Failed to initlize Web Worker", error);
			onErrorRef.current?.(
				error instanceof Error ? error.message : String(error),
			);
			setWorkerStatus("error");
		}

		return () => {
			if (workerRef.current && !didTerminate) {
				console.log("Terminating wroker...");
				workerRef.current.terminate();
				workerRef.current = null;
				setWorkerStatus("terminated");
				didTerminate = true;
			}
		};
	}, []);

	const postMessage = useCallback(
		(message: MainToWorkerMessage) => {
			if (workerRef.current && workerStatus === "ready") {
				workerRef.current.postMessage(message);
			} else {
				console.warn(`Worker not ready (status: ${workerStatus})`, message);
			}
		},
		[workerStatus],
	);

	return { postMessage, workerStatus };
};
