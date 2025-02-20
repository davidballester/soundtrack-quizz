"use client";

import { Box, Flex, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LoadingQuizz } from "./loadingQuizz";
import { IQuizz, IQuizzDatabase } from "@/models/quizz";
import { QuizzEntry } from "./quizzEntry";
import { PlayerProvider } from "./playerProvider";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "./ui/pagination";
import { QuizzSuccess } from "./quizzSuccess";

export function Quizz({
  onResolved,
  length = 10,
}: {
  onResolved: () => void;
  length?: number;
}) {
  const quizz = useQuizz({ length });
  const [resolved, setResolved] = useState<number>(0);
  const [currentQuizEntryIndex, setCurrentQuizzEntryIndex] =
    useState<number>(0);
  useEffect(() => {
    if (!quizz || resolved !== quizz.length) {
      return;
    }
    onResolved();
  }, [onResolved, resolved, quizz]);
  if (!quizz) {
    return <LoadingQuizz />;
  }
  return (
    <PlayerProvider>
      {resolved === quizz.length ? <QuizzSuccess /> : null}
      <Box display="grid">
        <Box gridArea="1 / 1">
          <LoadingQuizz />
        </Box>
        <Box gridArea="1 / 1">
          <Flex direction="column" gap="8" align="center">
            {quizz.map((quizzEntry, index) => (
              <Box
                key={quizzEntry.videoId}
                hidden={index !== currentQuizEntryIndex}
                w="full"
              >
                <QuizzEntry
                  quizzEntry={quizzEntry}
                  onResolved={() => setResolved(resolved + 1)}
                />
              </Box>
            ))}
            <PaginationRoot
              count={quizz.length}
              pageSize={1}
              defaultPage={1}
              onPageChange={(e) => setCurrentQuizzEntryIndex(e.page - 1)}
            >
              <HStack>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
              </HStack>
            </PaginationRoot>
          </Flex>
        </Box>
      </Box>
    </PlayerProvider>
  );
}

function useQuizz({ length }: { length: number }): IQuizz | null {
  const quizzDatabase = useQuizzDatabase();
  const [quizz, setQuizz] = useState<IQuizz | null>(null);
  useEffect(() => {
    if (!quizzDatabase) {
      return;
    }
    const shuffledQuizzDatabase = shuffle([...quizzDatabase]);
    const quizz = shuffledQuizzDatabase.slice(0, length);
    setQuizz(quizz);
  }, [quizzDatabase, setQuizz]);
  return quizz;
}

function useQuizzDatabase(): IQuizzDatabase | null {
  const [quizz, setQuizz] = useState<IQuizzDatabase | null>(null);
  useEffect(() => {
    fetch("/quizz.json").then(async (response) => {
      const quizz = await response.json();
      setQuizz(quizz);
    });
  }, [setQuizz]);
  return quizz;
}

function shuffle<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}
