import { useAtom } from "jotai";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Volume2, X } from "lucide-react";
import {
	settingsAtom,
	type SoundType,
	type PomodoroSettings,
} from "@/store/settings";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { useNotificationSound } from "@/lib/hooks/useNotificationSound";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { SettingBlock } from "../layout/setting/setting-block";
import { InputTime } from "./input-time";

const soundTypes: SoundType[] = ["bell", "chime", "beep"];

/* const soundTypeLabels: Record<SoundType, string> = {
	bell: "ベル",
	chime: "チャイム",
	beep: "ビープ",
} */

export function Settings() {
	const [settings, setSettings] = useAtom(settingsAtom);
	const [isOpen, setIsOpen] = useState(false);
	const [tempSettings, setTempSettings] = useState<PomodoroSettings>(settings);

	const { getSoundPath } = useNotificationSound();

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

	const handleCheckboxChange =
		(name: string) => (checked: boolean | "indeterminate") => {
			setTempSettings({
				...tempSettings,
				[name]: checked === "indeterminate" ? false : checked,
			});
		};

	// Handle input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setTempSettings({
			...tempSettings,
			[name]: Number(value),
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
					<div className="bg-card rounded-lg border border-border p-3 w-full max-w-md mx-auto h-fit max-h-fit grid grid-cols-1 gap-6">
						{/* タイトルと閉じるボタン */}
						<div className="flex justify-between items-center ">
							<h2 className="text-xl font-semibold">Settings</h2>
							<Button variant="ghost" size="icon" onClick={closeSettings}>
								<X className="h-5 w-5" />
								<span className="sr-only">Close</span>
							</Button>
						</div>
						{/* セッティング項目 */}
						<div className="grid grid-cols-1 gap-4">
							<SettingBlock title="Timer (minutes)">
								<div className="grid grid-cols-[repeat(3,1fr)] gap-4 gap-x-6">
									<InputTime
										label="Work"
										id="workTime"
										name="workTime"
										min="1"
										max="60"
										value={tempSettings.workTime}
										onChange={handleChange}
									/>
									<InputTime
										label="Short Break"
										id="shortBreakTime"
										name="shortBreakTime"
										min="1"
										max="30"
										value={tempSettings.shortBreakTime}
										onChange={handleChange}
									/>
									<InputTime
										label="Long Break"
										id="longBreakTime"
										name="longBreakTime"
										min="1"
										max="60"
										value={tempSettings.longBreakTime}
										onChange={handleChange}
									/>
									<InputTime
										label="Long Break Interval"
										id="longBreakInterval"
										name="longBreakInterval"
										min="1"
										max="10"
										value={tempSettings.longBreakInterval}
										onChange={handleChange}
										annotation="Number of work sessions before a long break"
										isMinutes={false}
										className="row-start-2 row-end-2 col-start-1 col-end-4"
									/>
								</div>
							</SettingBlock>

							<SettingBlock title="Auto Start">
								<div className="space-y-2">
									<div className="flex items-center">
										<Checkbox
											id="autoStartBreak"
											name="autoStartBreak"
											checked={tempSettings.autoStartBreak}
											onCheckedChange={handleCheckboxChange("autoStartBreak")}
											className="mr-2"
										/>
										<label htmlFor="autoStartBreak" className="text-sm">
											Auto-start breaks
										</label>
									</div>
									<div className="flex items-center">
										<Checkbox
											id="autoStartWork"
											name="autoStartWork"
											checked={tempSettings.autoStartWork}
											onCheckedChange={handleCheckboxChange("autoStartWork")}
											className="mr-2"
										/>
										<label htmlFor="autoStartWork" className="text-sm">
											Auto-start work sessions
										</label>
									</div>
								</div>
							</SettingBlock>

							<SettingBlock title="Alert Sound">
								<div className="w-full h-full items-center flex justify-start gap-8">
									<Select
										value={tempSettings.soundType}
										onValueChange={(value: SoundType) => {
											setTempSettings({
												...tempSettings,
												soundType: value,
											});
										}}
									>
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Select Alerm sound" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{soundTypes.map((type) => (
													<SelectItem key={type} value={type}>
														{type}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>

									{/* テスト再生ボタン */}
									<Button
										variant="outline"
										size="sm"
										className="w-fit flex items-center justify-center gap-2"
										onClick={() => {
											// 現在の設定でテスト再生
											const audio = new Audio(
												getSoundPath(tempSettings.soundType),
											);
											audio.volume = tempSettings.soundVolume / 100;
											audio
												.play()
												.catch((error) =>
													console.warn("テスト再生エラー:", error),
												);
										}}
									>
										<Volume2 size={16} />
										test
									</Button>
								</div>
								<div className="flex items-center gap-2 pl-2">
									<Volume2 size={16} />
									<Slider
										id="soundVolume"
										defaultValue={[tempSettings.soundVolume]}
										min={0}
										max={100}
										step={1}
										onValueChange={(values) => {
											setTempSettings({
												...tempSettings,
												soundVolume: values[0],
											});
										}}
									/>
								</div>
							</SettingBlock>
						</div>

						{/* キャンセル・閉じるボタン */}
						<div className="w-full h-full  flex justify-end gap-6 ">
							<Button variant="outline" onClick={closeSettings}>
								Cancel
							</Button>
							<Button onClick={saveSettings}>Save</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
