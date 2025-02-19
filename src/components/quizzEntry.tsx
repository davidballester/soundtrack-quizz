import { IQuizzDatabaseEntry } from "@/models/quizz";
import { Player } from "./player";
import { useCallback, useState } from "react";
import { Button, Flex, Input } from "@chakra-ui/react";
import { Field } from "./ui/field";
import { InputGroup } from "./ui/input-group";
import { LuBadge, LuBadgeCheck, LuBadgeX, LuLightbulb } from "react-icons/lu";

export function QuizzEntry({
  quizzEntry,
  onResolved,
}: {
  quizzEntry: IQuizzDatabaseEntry;
  onResolved: () => void;
}) {
  const [guess, setGuess] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [resolved, setResolved] = useState<boolean>(false);
  const checkGuess = useCallback(
    (guess: string) => {
      const isCorrect = new RegExp(quizzEntry.show, "i").test(guess);
      if (isCorrect) {
        setResolved(true);
        onResolved();
      } else {
        setError(true);
      }
    },
    [setError, onResolved]
  );
  return (
    <Flex direction="column" gap="4">
      <Player
        width={640}
        height={480}
        resolved={resolved}
        videoId={quizzEntry.videoId}
        durationInSeconds={quizzEntry.durationInSeconds}
        startAtSeconds={quizzEntry.startAtSeconds}
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
              <LuLightbulb />
            </Button>
          }
          width="full"
        >
          <Input
            placeholder="Guess the TV series"
            size="lg"
            value={guess}
            onChange={(event) => {
              setGuess(event.target.value);
              setError(false);
            }}
            onKeyUp={(event) => {
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
    </Flex>
  );
}
