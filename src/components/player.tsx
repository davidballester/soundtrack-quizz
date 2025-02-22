"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { LuPlay } from "react-icons/lu";
import { YouTubeApiReadyContext } from "@/contexts/youTubeApiReadyContext";

export function Player({
  resolved,
  videoId,
  startAtSeconds = 15,
  durationInSeconds = 3,
  onPlay,
}: {
  resolved: boolean;
  videoId: string;
  startAtSeconds?: number;
  durationInSeconds?: number;
  onPlay: () => void;
}) {
  const [playing, setPlaying] = useState<boolean>(false);
  const { player, ready, started } = usePlayer({ videoId });
  const play = useCallback(() => {
    if (!player) {
      return;
    }
    console.log("player", videoId, "playing");
    onPlay();
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
    <Box display="grid">
      <Box
        gridArea="1 / 1"
        clipPath={resolved ? "none" : "ellipse(40px 30px at center)"}
      >
        <iframe
          id={videoId}
          width="100%"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${location.origin}&autoplay=0&controls=0&fs=0&playsinline=1&disablekb=1&color=white`}
          style={{ aspectRatio: "16 / 9" }}
        ></iframe>
      </Box>
      <Flex
        background="gray.900"
        opacity={resolved ? 0 : 1}
        transition="opacity 0.2s ease-out"
        alignItems="center"
        justifyContent="center"
        pointerEvents={resolved || !started ? "none" : "all"}
        gridArea="1 / 1"
      >
        <Button
          variant="subtle"
          colorPalette="pink"
          size="2xl"
          onClick={play}
          disabled={resolved || playing || !ready}
          loading={playing || !ready}
          title="Play"
          opacity={1}
        >
          <LuPlay />
        </Button>
      </Flex>
    </Box>
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
  }, [youTubeApiReady, videoId, setStarted, setReady]);
  return { player, ready, started };
}
