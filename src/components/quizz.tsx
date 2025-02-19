"use client";

import { Box, Flex, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LoadingQuizz } from "./loadingQuizz";
import { IQuizz, IQuizzDatabase } from "@/models/quizz";
import { QuizzEntry } from "./quizzEntry";
import { PlayerProvider } from "./player";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "./ui/pagination";

export function Quizz({ length = 10 }: { length?: number }) {
  const quizz = useQuizz({ length });
  const [currentQuizEntryIndex, setCurrentQuizzEntryIndex] =
    useState<number>(0);
  if (!quizz) {
    return <LoadingQuizz />;
  }
  return (
    <PlayerProvider>
      <Flex direction="column" gap="8" align="center">
        {quizz.map((quizzEntry, index) => (
          <Box
            key={quizzEntry.videoId}
            hidden={index !== currentQuizEntryIndex}
          >
            <QuizzEntry
              quizzEntry={quizzEntry}
              onResolved={() => {
                /* TODO */
              }}
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
