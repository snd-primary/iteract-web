"use client";

import { Button } from "@/components/ui/button";
import {
	SpeakerLoudIcon,
	SpeakerOffIcon,
	Cross1Icon,
} from "@radix-ui/react-icons";
import type { SoundType } from "@/store/settings";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "@/components/ui/slider";
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
import { useTranslations } from "next-intl";

const soundTypes: SoundType[] = ["digital", "bell1", "bell2", "beep"];

export function Settings() {
	const t = useTranslations("settings");

	const {
		closeSettings,
		saveSettings,
		handleCheckboxChange,
		handleChange,
		settingsOpen,
		getSoundPath,
		tempSettings,
		setTempSettings,
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
						<div className="bg-card  border border-border p-3 w-full max-w-md mx-auto h-fit max-h-fit grid grid-cols-1 gap-4">
							{/* タイトルと閉じるボタン */}
							<div className="flex justify-between items-center ">
								<h2 className="text-xl font-semibold">{t("title")}</h2>
								<Button
									variant="ghost"
									size="icon"
									onClick={closeSettings}
									className="size-8"
								>
									<Cross1Icon className="h-5 w-5" />
									<span className="sr-only">Close</span>
								</Button>
							</div>
							{/* セッティング項目 */}
							<div className="grid grid-cols-1 gap-4">
								<SettingBlock title={t("timer.title")}>
									<div className="grid grid-cols-2 gap-y-4">
										<InputTime
											label={t("timer.work")}
											id="workTime"
											name="workTime"
											min="1"
											max="60"
											value={tempSettings.workTime}
											onChange={handleChange}
										/>
										<InputTime
											label={t("timer.shortBreak")}
											id="shortBreakTime"
											name="shortBreakTime"
											min="1"
											max="30"
											value={tempSettings.shortBreakTime}
											onChange={handleChange}
										/>
										<InputTime
											label={t("timer.longBreak")}
											id="longBreakTime"
											name="longBreakTime"
											min="1"
											max="60"
											value={tempSettings.longBreakTime}
											onChange={handleChange}
										/>
										<InputTime
											label={t("timer.longBreakInterval")}
											id="longBreakInterval"
											name="longBreakInterval"
											min="1"
											max="10"
											value={tempSettings.longBreakInterval}
											onChange={handleChange}
											isMinutes={false}
										/>
									</div>
								</SettingBlock>

								<SettingBlock title={t("autoStart.title")}>
									<div className="space-y-2">
										<div className="flex items-center ">
											<Checkbox
												id="autoStartBreak"
												name="autoStartBreak"
												checked={tempSettings.autoStartBreak}
												onCheckedChange={handleCheckboxChange("autoStartBreak")}
												className="mr-2"
											/>
											<label htmlFor="autoStartBreak" className="text-sm">
												{t("autoStart.breaks")}
											</label>
										</div>
										<div className="flex items-center ">
											<Checkbox
												id="autoStartWork"
												name="autoStartWork"
												checked={tempSettings.autoStartWork}
												onCheckedChange={handleCheckboxChange("autoStartWork")}
												className="mr-2"
											/>
											<label htmlFor="autoStartWork" className="text-sm">
												{t("autoStart.work")}
											</label>
										</div>
									</div>
								</SettingBlock>

								<SettingBlock title={t("sound.title")}>
									<div className="flex items-center gap-4">
										<Select
											value={tempSettings.soundType}
											onValueChange={(value: SoundType) => {
												setTempSettings((prevTempSettings) => ({
													...prevTempSettings,
													soundType: value,
												}));
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
											{t("sound.test")}
										</Button>
									</div>

									{/* 音量スライダー */}
									<div className="flex items-center gap-2">
										{tempSettings.soundVolume <= 0 ? (
											<SpeakerOffIcon width={16} />
										) : (
											<SpeakerLoudIcon width={16} />
										)}
										<Slider
											value={[tempSettings.soundVolume]}
											onValueChange={(value: number[]) => {
												setTempSettings((prevTempSettings) => ({
													...prevTempSettings,
													soundVolume: value[0],
												}));
											}}
											max={100}
											step={10}
											className="w-[180px]"
										/>
										<span className="text-sm w-8 text-right">
											{tempSettings.soundVolume}%
										</span>
									</div>
								</SettingBlock>
							</div>

							{/* キャンセル・閉じるボタン */}
							<div className="w-full h-full  flex justify-end gap-6 ">
								<Button variant="outline" onClick={closeSettings}>
									{t("buttons.cancel")}
								</Button>
								<Button onClick={saveSettings}>{t("buttons.save")}</Button>
							</div>
						</div>
					</motion.div>
				</AnimatePresence>
			)}
		</>
	);
}
