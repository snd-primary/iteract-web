"use client";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { themeAtom, type ThemeMode } from "@/store/theme";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [theme, setTheme] = useAtom(themeAtom);

	// マウント時にクライアントサイドのテーマを決定し、atomに設定する (一度だけ実行)
	useEffect(() => {
		let initialClientTheme: ThemeMode = "light"; // デフォルト値
		try {
			const storedTheme = localStorage.getItem("theme");
			if (storedTheme === "dark" || storedTheme === "light") {
				initialClientTheme = storedTheme;
			} else {
				// localStorageにない場合、OSの設定を確認
				const prefersDark = window.matchMedia(
					"(prefers-color-scheme: dark)",
				).matches;
				initialClientTheme = prefersDark ? "dark" : "light";
			}
		} catch (error) {
			console.error("Error reading theme preference in ThemeToggle:", error);
			// エラー時もフォールバックとしてOS設定を確認
			try {
				const prefersDark = window.matchMedia(
					"(prefers-color-scheme: dark)",
				).matches;
				initialClientTheme = prefersDark ? "dark" : "light";
			} catch (fallbackError) {
				console.error(
					"Error reading fallback theme preference:",
					fallbackError,
				);
				// ここでもエラーなら 'light' のまま
			}
		}

		// マウント時に決定したクライアントテーマをatomに設定
		// このコンポーネントが表示された時点でクライアントの状態をatomに反映させる
		setTheme(initialClientTheme);

		// マウント完了
		setIsMounted(true);
	}, [setTheme]); // setTheme は通常不変なので、実質マウント時に一度だけ実行される

	// Apply theme to document
	useEffect(() => {
		if (!isMounted || !theme) return;
		const root = window.document.documentElement;

		if (theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}

		// アクセシビリティのためカラースキームを設定
		document.documentElement.setAttribute("data-theme", theme);

		// メタタグも更新して、ブラウザUIに通知
		const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
		if (metaColorScheme) {
			metaColorScheme.setAttribute("content", theme);
		}

		try {
			// localStorageへの保存はこのEffectに一元化
			localStorage.setItem("theme", theme);
		} catch (error) {
			console.error("Failed to save theme to localStorage", error);
		}
	}, [isMounted, theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	if (!isMounted) {
		return null;
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			className="rounded-full absolute top-4 right-4"
		>
			{theme === "light" ? (
				<Sun className="h-5 w-5" />
			) : (
				<Moon className="h-5 w-5" />
			)}
			<span className="sr-only">
				{theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
			</span>
		</Button>
	);
}
