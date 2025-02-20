"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button } from "@chakra-ui/react";
import { LuPlay } from "react-icons/lu";
import "./player.css";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubeApiReadyContext = createContext<boolean>(false);

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

export function Player({
  resolved,
  videoId,
  width,
  height,
  startAtSeconds = 15,
  durationInSeconds = 3,
}: {
  resolved: boolean;
  videoId: string;
  width: number;
  height: number;
  startAtSeconds?: number;
  durationInSeconds?: number;
}) {
  const [playing, setPlaying] = useState<boolean>(false);
  const { player, ready, started } = usePlayer({ videoId });
  const play = useCallback(() => {
    if (!player) {
      return;
    }
    setPlaying(true);
    player.seekTo(startAtSeconds, true);
    player.playVideo();
    setTimeout(() => {
      player.pauseVideo();
      setPlaying(false);
    }, durationInSeconds * 1e3);
  }, [player]);
  useEffect(() => {
    if (!player || !started) {
      return;
    }
    play();
  }, [player, started]);
  return (
    <div className={`player ${started ? "started" : ""}`}>
      <div className={`blur-overlay ${resolved ? "hidden" : ""}`}>
        <Button
          size="2xl"
          onClick={play}
          disabled={resolved || playing || !ready}
          loading={playing || !ready}
          title="Play"
          style={{ cursor: "pointer" }}
        >
          <LuPlay />
        </Button>
      </div>
      <iframe
        id={videoId}
        width={width}
        height={height}
        src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${location.origin}&autoplay=0&controls=0&fs=0&playsinline=1&disablekb=1&color=white`}
      ></iframe>
    </div>
  );
}

function usePlayer({ videoId }: { videoId: string }): {
  player: YT.Player | null;
  ready: boolean;
  started: boolean;
} {
  const youTubeApiReady = useContext(YouTubeApiReadyContext);
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [started, setStarted] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  useEffect(() => {
    if (!youTubeApiReady) {
      return;
    }
    const newPlayer = new YT.Player(videoId, {
      events: {
        onReady: () => setReady(true),
        onStateChange: () => {
          if (
            started ||
            newPlayer.getPlayerState() !== YT.PlayerState.PLAYING
          ) {
            return;
          }
          setStarted(true);
        },
      },
    });
    setPlayer(newPlayer);
    return () => newPlayer.stopVideo();
  }, [youTubeApiReady, videoId, setStarted, setReady]);
  return { player, ready, started };
}
