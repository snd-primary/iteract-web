"use client";

import type {
	MainToWorkerMessage,
	WorkerToMainMessage,
} from "@/types/workerMessages";
import { useCallback, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { workerAtom } from "@/store/worker";
import type { WorkerStatus } from "@/store/worker";

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
	// Use the workerAtom
	const [workerState, setWorkerState] = useAtom(workerAtom);
	// Use useAtomValue to get the current status without causing re-renders just for status access in postMessage
	const { worker, status: workerStatus } = workerState;

	// Refs to hold the latest callback functions
	const onMessageRef = useRef(onMessage);
	const onErrorRef = useRef(onError);

	useEffect(() => {
		onMessageRef.current = onMessage;
	}, [onMessage]);

	useEffect(() => {
		onErrorRef.current = onError;
	}, [onError]);

	// Initialize worker and attach/detach listeners based on atom state
	useEffect(() => {
		if (typeof window === "undefined") return;

		let currentWorker = worker; // Get worker instance from atom
		// Use const for needsInitialization as it's not reassigned
		const needsInitialization = !currentWorker && workerStatus === "idle";

		// --- Worker Initialization ---
		if (needsInitialization) {
			setWorkerState((prev) => ({ ...prev, status: "initializing" }));
			try {
				console.log("Initializing new timer worker...");
				currentWorker = new Worker(
					new URL("../../workers/timerWorker.ts", import.meta.url),
				);
				setWorkerState({ worker: currentWorker, status: "ready" });
				console.log("Worker initialized and stored in atom.");
			} catch (error) {
				console.error("Failed to initialize Web Worker", error);
				setWorkerState({ worker: null, status: "error" });
				onErrorRef.current?.(
					error instanceof Error ? error.message : String(error),
				);
				return; // Stop if initialization failed
			}
		}

		// --- Listener Management ---
		if (currentWorker) {
			const handleMessage = (event: MessageEvent<WorkerToMainMessage>) => {
				onMessageRef.current?.(event);
			};
			const handleError = (event: Event) => {
				console.error("Worker error event (via atom)", event);
				onErrorRef.current?.(event);
				// Update atom status if worker errors out
				setWorkerState((prev) => {
					// Only update if the worker instance is the same to avoid race conditions
					if (prev.worker === currentWorker) {
						return { ...prev, status: "error" };
					}
					return prev;
				});
			};

			// Attach listeners
			currentWorker.addEventListener("message", handleMessage);
			currentWorker.addEventListener("error", handleError);
			console.log("Attached listeners to worker.");

			// Cleanup: Remove listeners when the component using the hook unmounts
			return () => {
				if (currentWorker) {
					console.log("Detaching listeners from worker.");
					currentWorker.removeEventListener("message", handleMessage);
					currentWorker.removeEventListener("error", handleError);
				}
			};
		}
		// No cleanup needed if worker is null or initialization failed
		return undefined;
	}, [worker, workerStatus, setWorkerState]); // Depend on atom state

	// Post message function
	const postMessage = useCallback(
		(message: MainToWorkerMessage) => {
			// Access worker and status from the hook's state (derived from atom)
			if (worker && workerStatus === "ready") {
				worker.postMessage(message);
			} else {
				console.warn(
					`Worker not ready (status: ${workerStatus}), cannot post message:`,
					message,
				);
			}
		},
		[worker, workerStatus], // Depend on worker and status from workerState
	);

	// Return the status from the atom and the postMessage function
	return { postMessage, workerStatus };
};
