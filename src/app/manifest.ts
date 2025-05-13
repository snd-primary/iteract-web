import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Iteract - Pomodoro Timer",
    short_name: "Iteract",
    description: "Boost your productivity with Iteract, a simple and interactive Pomodoro timer app.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#000000",
    theme_color: "#000000",
    categories: ["productivity", "utilities", "timer"],
    dir: "ltr",
    lang: "en",
    scope: "/",
    icons: [
      {
        src: "/icon/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icon/icon-384x384.png",
        sizes: "384x384",
        type: "image/png"
      },
      {
        src: "/icon/icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/icon/apple-touch-icon.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "any"
      }
    ],
    screenshots: [
      {
        src: "/screenshots/screenshot1.png",
        sizes: "1280x720",
        type: "image/png",
        label: "Pomodoro Timer in action"
      }
    ]
  };
}