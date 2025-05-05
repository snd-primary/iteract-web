import { atom } from "jotai";

export type WorkerStatus =
	| "idle" // No worker instance exists or not yet initialized
	| "initializing" // Worker is being created
	| "ready" // Worker is active and ready for messages
	| "error" // Worker encountered an error
	| "terminated"; // Worker has been terminated

interface WorkerState {
	worker: Worker | null;
	status: WorkerStatus;
}

const initialWorkerState: WorkerState = {
	worker: null,
	status: "idle",
};

/**
 * Atom to hold the singleton Web Worker instance for the timer.
 */
export const workerAtom = atom<WorkerState>(initialWorkerState);
