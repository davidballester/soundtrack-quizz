"use client";

import { YouTubeApiReadyContext } from "@/contexts/youTubeApiReadyContext";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [youTubeApiReady, setYouTubeApiReady] = useState<boolean>(false);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
    window.onYouTubeIframeAPIReady = () => {
      setYouTubeApiReady(true);
    };
  }, []);
  return (
    <YouTubeApiReadyContext.Provider value={youTubeApiReady}>
      {children}
    </YouTubeApiReadyContext.Provider>
  );
}
