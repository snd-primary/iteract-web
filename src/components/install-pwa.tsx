"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Cross1Icon, DownloadIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  
  // next-intlの使用
  const t = useTranslations("pwa.installBanner");

  useEffect(() => {
    // PWAがすでにインストールされているかどうかを確認
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsAppInstalled(true);
      return;
    }

    // インストールプロンプトイベントをリッスン
    const handleBeforeInstallPrompt = (e: Event) => {
      // デフォルトの挙動を防止
      e.preventDefault();
      // イベントを保存
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // バナーを表示
      setShowInstallBanner(true);
    };

    // アプリがインストールされたイベントをリッスン
    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setShowInstallBanner(false);
      // インストール完了後のアナリティクスやログなどをここに
      console.log("PWA was installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // バナーを1日1回のみ表示する
    const lastPrompt = localStorage.getItem("pwaPromptTime");
    const now = new Date().getTime();
    
    if (lastPrompt) {
      const lastPromptTime = parseInt(lastPrompt, 10);
      const oneDayInMs = 24 * 60 * 60 * 1000; // 1日をミリ秒で
      
      if (now - lastPromptTime > oneDayInMs) {
        setShowInstallBanner(true);
      } else {
        setShowInstallBanner(false);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // プロンプトを表示
    await deferredPrompt.prompt();
    
    // ユーザーの選択結果を待つ
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
    
    // プロンプトは一度しか使えないのでクリア
    setDeferredPrompt(null);
    setShowInstallBanner(false);
    
    // 最後に表示した時間を保存
    localStorage.setItem("pwaPromptTime", new Date().getTime().toString());
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    // 最後に表示した時間を保存
    localStorage.setItem("pwaPromptTime", new Date().getTime().toString());
  };

  // アプリがすでにインストールされている、または表示条件を満たさない場合は何も表示しない
  if (isAppInstalled || !showInstallBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t shadow-lg z-50 animate-in slide-in-from-bottom">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex-1">
          <h3 className="text-sm font-medium">{t('title')}</h3>
          <p className="text-xs text-muted-foreground">
            {t('description')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            <Cross1Icon className="h-4 w-4 mr-1" />
            {t('cancelButton')}
          </Button>
          <Button size="sm" onClick={handleInstallClick}>
            <DownloadIcon className="h-4 w-4 mr-1" />
            {t('installButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}