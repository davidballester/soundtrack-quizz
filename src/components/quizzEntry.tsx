import { IQuizzDatabaseEntry } from "@/models/quizz";
import { Player } from "./player";
import { useCallback, useRef, useState } from "react";
import { Button, Flex, Input } from "@chakra-ui/react";
import { Field } from "./ui/field";
import { InputGroup } from "./ui/input-group";
import {
  LuBadge,
  LuBadgeCheck,
  LuBadgeX,
  LuFlag,
  LuSearch,
} from "react-icons/lu";

export function QuizzEntry({
  quizzEntry,
  onResolved,
  onGiveUp,
  onFailedAttempt,
}: {
  quizzEntry: IQuizzDatabaseEntry;
  onResolved: () => void;
  onGiveUp: () => void;
  onFailedAttempt: () => void;
}) {
  const [guess, setGuess] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [resolved, setResolved] = useState<boolean>(false);
  const checkGuess = useCallback(
    (guess: string) => {
      const sanitizedShowName = sanitize(quizzEntry.show);
      const sanitizedGuess = sanitize(guess);
      const isCorrect = sanitizedShowName === sanitizedGuess;
      if (isCorrect) {
        setResolved(true);
        onResolved();
        ref.current?.blur();
      } else {
        setError(true);
        onFailedAttempt();
      }
    },
    [setError, onResolved]
  );
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Flex direction="column" gap="4" w="full">
      <Player
        resolved={resolved}
        videoId={quizzEntry.videoId}
        durationInSeconds={quizzEntry.durationInSeconds}
        startAtSeconds={quizzEntry.startAtSeconds}
        onPlay={() => {
          if (!ref.current) {
            return;
          }
          ref.current.focus();
        }}
      ></Player>
      <Field invalid={error}>
        <InputGroup
          flexGrow="1"
          startElement={
            resolved ? <LuBadgeCheck /> : error ? <LuBadgeX /> : <LuBadge />
          }
          endElement={
            <Button
              title="guess"
              onClick={() => checkGuess(guess)}
              variant="ghost"
              disabled={resolved}
            >
              <LuSearch />
            </Button>
          }
          width="full"
        >
          <Input
            ref={ref}
            placeholder="Guess the TV series"
            size="lg"
            value={guess}
            onChange={(event) => {
              setGuess(event.target.value);
              setError(false);
            }}
            onKeyUp={(event) => {
              event.stopPropagation();
              if (event.key !== "Enter") {
                return;
              }
              checkGuess(guess);
            }}
            flex="1"
            pr="0"
            disabled={resolved}
            borderColor={resolved ? "green.500" : undefined}
          />
        </InputGroup>
      </Field>
      <Button
        opacity={resolved ? 0 : 1}
        onClick={() => {
          onGiveUp();
          setResolved(true);
          ref.current?.blur();
        }}
        variant="ghost"
        w="auto"
      >
        <LuFlag /> I give up!
      </Button>
    </Flex>
  );
}

function sanitize(s: string = ""): string {
  return s
    .toLowerCase()
    .replace(/\b(the|a|an|of|and|in|on|at|to|for|with|from|by)\b/gi, "")
    .replace(/[^a-zA-Z]/g, "");
}
