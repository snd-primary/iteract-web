// src/workers/worker.d.ts

declare module "*.worker.ts" {
	class WebpackWorker extends Worker {
		constructor();
	}
	export default WebpackWorker;
}
