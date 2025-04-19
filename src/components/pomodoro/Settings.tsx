import { useAtom } from "jotai";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, X } from "lucide-react";
import { settingsAtom, type PomodoroSettings } from "@/store/settings";

export function Settings() {
	const [settings, setSettings] = useAtom(settingsAtom);
	const [isOpen, setIsOpen] = useState(false);
	const [tempSettings, setTempSettings] = useState<PomodoroSettings>(settings);

	// Open settings panel
	const openSettings = () => {
		setTempSettings({ ...settings });
		setIsOpen(true);
	};

	// Close settings panel
	const closeSettings = () => {
		setIsOpen(false);
	};

	// Save settings
	const saveSettings = () => {
		setSettings(tempSettings);
		setIsOpen(false);
	};

	// Handle input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setTempSettings({
			...tempSettings,
			[name]: type === "checkbox" ? checked : Number(value),
		});
	};

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				onClick={openSettings}
				className="absolute top-4 left-4 rounded-full"
			>
				<SettingsIcon className="h-5 w-5" />
				<span className="sr-only">Settings</span>
			</Button>

			{isOpen && (
				<div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
					<div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-auto">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-semibold">Settings</h2>
							<Button variant="ghost" size="icon" onClick={closeSettings}>
								<X className="h-5 w-5" />
								<span className="sr-only">Close</span>
							</Button>
						</div>

						<div className="space-y-6">
							<div className="space-y-4">
								<h3 className="text-md font-medium">Timer (minutes)</h3>
								<div className="grid grid-cols-3 gap-4">
									<div className="space-y-2">
										<label htmlFor="workTime" className="text-sm">
											Work
										</label>
										<input
											type="number"
											id="workTime"
											name="workTime"
											min="1"
											max="60"
											value={tempSettings.workTime}
											onChange={handleChange}
											className="w-full border border-input rounded-md px-3 py-2 text-sm"
										/>
									</div>
									<div className="space-y-2">
										<label htmlFor="shortBreakTime" className="text-sm">
											Short Break
										</label>
										<input
											type="number"
											id="shortBreakTime"
											name="shortBreakTime"
											min="1"
											max="30"
											value={tempSettings.shortBreakTime}
											onChange={handleChange}
											className="w-full border border-input rounded-md px-3 py-2 text-sm"
										/>
									</div>
									<div className="space-y-2">
										<label htmlFor="longBreakTime" className="text-sm">
											Long Break
										</label>
										<input
											type="number"
											id="longBreakTime"
											name="longBreakTime"
											min="1"
											max="60"
											value={tempSettings.longBreakTime}
											onChange={handleChange}
											className="w-full border border-input rounded-md px-3 py-2 text-sm"
										/>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<label htmlFor="longBreakInterval" className="text-sm">
									Long Break Interval
								</label>
								<input
									type="number"
									id="longBreakInterval"
									name="longBreakInterval"
									min="1"
									max="10"
									value={tempSettings.longBreakInterval}
									onChange={handleChange}
									className="w-full border border-input rounded-md px-3 py-2 text-sm"
								/>
								<p className="text-xs text-muted-foreground mt-1">
									Number of work sessions before a long break
								</p>
							</div>

							<div className="space-y-4">
								<h3 className="text-md font-medium">Auto Start</h3>
								<div className="space-y-2">
									<div className="flex items-center">
										<input
											type="checkbox"
											id="autoStartBreak"
											name="autoStartBreak"
											checked={tempSettings.autoStartBreak}
											onChange={handleChange}
											className="mr-2"
										/>
										<label htmlFor="autoStartBreak" className="text-sm">
											Auto-start breaks
										</label>
									</div>
									<div className="flex items-center">
										<input
											type="checkbox"
											id="autoStartWork"
											name="autoStartWork"
											checked={tempSettings.autoStartWork}
											onChange={handleChange}
											className="mr-2"
										/>
										<label htmlFor="autoStartWork" className="text-sm">
											Auto-start work sessions
										</label>
									</div>
								</div>
							</div>

							<div className="flex justify-end space-x-2 mt-8">
								<Button variant="outline" onClick={closeSettings}>
									Cancel
								</Button>
								<Button onClick={saveSettings}>Save</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
