import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Memoir - ふたりの旅の記憶",
    short_name: "Memoir",
    description: "旅行の予定、予約情報、写真、思い出をまとめる旅のしおり。",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#334155",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  };
}
