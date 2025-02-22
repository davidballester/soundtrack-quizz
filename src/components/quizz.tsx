"use client";

import { Box, Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LoadingQuizz } from "./loadingQuizz";
import { IQuizz, IQuizzDatabase, IQuizzState } from "@/models/quizz";
import { QuizzEntry } from "./quizzEntry";
import { PlayerProvider } from "./playerProvider";
import { QuizzSuccess } from "./quizzSuccess";
import { QuizzControls } from "./quizzControls";
import { Advices } from "./advices";

export function Quizz({
  onResolved,
  length = 10,
}: {
  onResolved: () => void;
  length?: number;
}) {
  const quizz = useQuizz({ length });
  const [quizzState, setQuizzState] = useQuizzState({ quizz });
  const resolved =
    quizzState.entries.length > 0 &&
    quizzState.entries.every(({ resolved }) => resolved);
  useEffect(() => {
    if (!resolved) {
      return;
    }
    onResolved();
  }, [onResolved, resolved]);
  if (!quizz) {
    return <LoadingQuizz />;
  }
  return (
    <PlayerProvider>
      {resolved ? <QuizzSuccess /> : null}
      <Box display="grid">
        <Box gridArea="1 / 1" mt="9">
          <LoadingQuizz />
        </Box>
        <Box gridArea="1 / 1">
          <Flex direction="column" gap="8" align="center">
            <QuizzControls
              state={quizzState}
              onClick={(index) => {
                setQuizzState({
                  ...quizzState,
                  currentEntryIndex: index,
                });
              }}
              onNext={() =>
                setQuizzState({
                  ...quizzState,
                  currentEntryIndex: quizzState.currentEntryIndex + 1,
                })
              }
              onPrev={() =>
                setQuizzState({
                  ...quizzState,
                  currentEntryIndex: quizzState.currentEntryIndex - 1,
                })
              }
            />
            {quizz.map((quizzEntry, index) => (
              <Box
                key={quizzEntry.videoId}
                hidden={index !== quizzState?.currentEntryIndex}
                w="full"
              >
                <QuizzEntry
                  quizzEntry={quizzEntry}
                  onResolved={() => {
                    setQuizzState({
                      ...quizzState,
                      entries: quizzState.entries.map((entry, i) =>
                        i === index
                          ? {
                              ...entry,
                              attempts: entry.attempts + 1,
                              resolved: true,
                            }
                          : entry
                      ),
                    });
                  }}
                  onFailedAttempt={() => {
                    setQuizzState({
                      ...quizzState,
                      entries: quizzState.entries.map((entry, i) =>
                        i === index
                          ? {
                              ...entry,
                              attempts: entry.attempts + 1,
                              resolved: false,
                            }
                          : entry
                      ),
                    });
                  }}
                  onGiveUp={() => {
                    setQuizzState({
                      ...quizzState,
                      entries: quizzState.entries.map((entry, i) =>
                        i === index
                          ? {
                              ...entry,
                              resolved: true,
                              givenUp: true,
                            }
                          : entry
                      ),
                    });
                  }}
                />
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>
      <Box mt="6">
        <Advices />
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
      const quizz = (await response.json()) as IQuizzDatabase;
      if (quizz.some(({ focus }) => focus)) {
        setQuizz(quizz.filter(({ focus }) => focus));
      } else {
        setQuizz(quizz);
      }
    });
  }, [setQuizz]);
  return quizz;
}

function useQuizzState({
  quizz,
}: {
  quizz: IQuizz | null;
}): [IQuizzState, Dispatch<SetStateAction<IQuizzState>>] {
  const [quizzState, setQuizzState] = useState<IQuizzState>({
    currentEntryIndex: 0,
    entries: [],
  });
  useEffect(() => {
    if (!quizz) {
      return;
    }
    setQuizzState({
      currentEntryIndex: 0,
      entries: quizz.map(() => ({
        attempts: 0,
        resolved: false,
        givenUp: false,
      })),
    });
  }, [quizz]);
  return [quizzState, setQuizzState];
}

function shuffle<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}
