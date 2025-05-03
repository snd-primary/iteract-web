"use client";

import { Button } from "@/components/ui/button";
import { SpeakerLoudIcon, Cross1Icon } from "@radix-ui/react-icons";
import type { SoundType } from "@/store/settings";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
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
import { useSettings } from "@/lib/hooks/useSettings";
import { AnimatePresence, motion } from "motion/react";

const soundTypes: SoundType[] = ["bell", "chime", "beep"];

export function Settings() {
	const {
		closeSettings,
		saveSettings,
		handleCheckboxChange,
		handleChange,
		settingsOpen,
		tempSettings,
		setTempSettings,
		getSoundPath,
	} = useSettings();

	return (
		<>
			{settingsOpen && (
				<AnimatePresence>
					<motion.div
						className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						key={"settings"}
					>
						<div className="bg-card  border border-border p-3 w-full max-w-md mx-auto h-fit max-h-fit grid grid-cols-1 gap-6">
							{/* タイトルと閉じるボタン */}
							<div className="flex justify-between items-center ">
								<h2 className="text-xl font-semibold">Settings</h2>
								<Button variant="ghost" size="icon" onClick={closeSettings}>
									<Cross1Icon className="h-5 w-5" />
									<span className="sr-only">Close</span>
								</Button>
							</div>
							{/* セッティング項目 */}
							<div className="grid grid-cols-1 gap-4">
								<SettingBlock title="Timer (minutes)">
									<div className="grid grid-cols-2 gap-y-8">
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
											<SpeakerLoudIcon width={16} />
											test
										</Button>
									</div>
									<div className="flex items-center gap-2 pl-2">
										<SpeakerLoudIcon width={16} />
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
					</motion.div>
				</AnimatePresence>
			)}
		</>
	);
}
