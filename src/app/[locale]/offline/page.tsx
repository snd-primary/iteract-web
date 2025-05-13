"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const t = useTranslations("pwa.offline");

  useEffect(() => {
    // サーバーでのレンダリング中は何もしない
    if (typeof window === "undefined") return;

    // 現在のオンライン状態を設定
    setIsOnline(navigator.onLine);

    // オンライン状態変更イベントリスナーを設定
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // クリーンアップ
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  // オンラインに戻った場合、リダイレクト
  useEffect(() => {
    if (isOnline) {
      window.location.replace("/");
    }
  }, [isOnline]);

  return (
    <div className="w-full h-[50vh] flex flex-col items-center justify-center gap-8 px-4 text-center">
      <svg
        width="120"
        height="120"
        viewBox="0 0 226 226"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-muted-foreground/30"
      >
        <title>iteract brandlogo</title>
        <path
          d="M167.944 26.9431C171.183 21.8697 169.716 15.0788 164.354 12.3432C142.861 1.37679 118.32 -2.46494 94.3344 1.55227C66.7503 6.17211 41.8595 20.8573 24.4765 42.7675C7.09347 64.6776 -1.5466 92.2558 0.227459 120.168C2.00152 148.08 14.0637 174.342 34.0808 193.875C54.0979 213.408 80.6476 224.824 108.595 225.914C136.542 227.004 163.9 217.692 185.378 199.778C206.856 181.864 220.928 156.621 224.871 128.932C228.3 104.855 223.859 80.416 212.37 59.1974C209.504 53.9042 202.679 52.6035 197.686 55.9659C192.694 59.3283 191.438 66.0783 194.181 71.4361C202.724 88.1217 205.959 107.126 203.291 125.859C200.109 148.206 188.751 168.58 171.416 183.038C154.081 197.497 132 205.013 109.444 204.133C86.8884 203.253 65.4601 194.039 49.3043 178.274C33.1485 162.509 23.4131 141.313 21.9813 118.785C20.5494 96.2573 27.5228 73.999 41.5527 56.3153C55.5825 38.6316 75.6719 26.7792 97.935 23.0505C116.597 19.925 135.675 22.6938 152.564 30.8261C157.988 33.4373 164.705 32.0165 167.944 26.9431Z"
          fill="currentColor"
        />
        <path
          d="M192.947 49.4926C197.66 45.7486 198.481 38.8501 194.301 34.5194C192.532 32.6876 190.703 30.9161 188.815 29.2078C184.351 25.1694 177.483 26.213 173.893 31.0446C170.303 35.8762 171.364 42.6595 175.733 46.7997C176.207 47.249 176.676 47.7033 177.14 48.1627C181.42 52.3959 188.233 53.2366 192.947 49.4926Z"
          fill="currentColor"
        />
        <path
          d="M191.754 117.221C193.96 117.34 195.854 115.647 195.866 113.438C195.97 93.7694 189.07 74.6534 176.329 59.5558C162.726 43.4369 143.489 33.1115 122.537 30.684C101.586 28.2565 80.4972 33.9095 63.5689 46.491C46.6407 59.0725 35.147 77.6356 31.4302 98.3972C27.7134 119.159 32.0532 140.556 43.5653 158.229C55.0773 175.902 72.8951 188.52 93.3876 193.512C113.88 198.504 135.505 195.494 153.855 185.096C171.042 175.356 184.145 159.821 190.871 141.338C191.626 139.262 190.437 137.017 188.327 136.362L132.694 119.108C130.584 118.454 128.381 119.672 127.243 121.565C125.779 123.999 123.704 126.037 121.194 127.459C117.514 129.545 113.177 130.149 109.067 129.147C104.957 128.146 101.383 125.616 99.0743 122.071C96.7654 118.527 95.8951 114.235 96.6405 110.071C97.3859 105.907 99.6911 102.184 103.086 99.661C106.481 97.1377 110.711 96.0039 114.913 96.4908C119.115 96.9777 122.973 99.0485 125.701 102.281C127.562 104.486 128.801 107.117 129.33 109.908C129.741 112.079 131.384 113.985 133.59 114.104L191.754 117.221Z"
          fill="currentColor"
        />
      </svg>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground whitespace-pre-line">
          {t('description')}
        </p>
      </div>

      <Button onClick={handleRefresh} className="mt-4">
        <RefreshCcwIcon className="mr-2 h-4 w-4" />
        {t('refreshButton')}
      </Button>
    </div>
  );
}