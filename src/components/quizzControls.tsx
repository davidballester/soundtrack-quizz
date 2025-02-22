import { IQuizzEntryState, IQuizzState } from "@/models/quizz";
import { Button, Grid, GridItem } from "@chakra-ui/react";
import { useEffect } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export function QuizzControls({
  state,
  onClick,
  onPrev,
  onNext,
}: {
  state: IQuizzState;
  onClick: (quizzEntryIndex: number) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const canGoLeft = state.currentEntryIndex > 0;
  const canGoRight = state.currentEntryIndex < state.entries.length - 1;
  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && canGoRight) {
        onNext();
      } else if (event.key === "ArrowLeft" && canGoLeft) {
        onPrev();
      }
    };
    document.addEventListener("keyup", eventListener);
    return () => document.removeEventListener("keyup", eventListener);
  }, [onNext, onPrev, canGoLeft, canGoRight]);
  return state ? (
    <Grid templateColumns={`repeat(${state.entries.length + 2}, 1fr)`} gap={2}>
      <Button
        variant="ghost"
        title="Previous"
        disabled={!canGoLeft}
        onClick={onPrev}
      >
        <LuChevronLeft />
      </Button>
      {state.entries.map((entryState, index) => (
        <GridItem key={index}>
          <QuizzControl
            state={entryState}
            onClick={() => onClick(index)}
            isActive={index === state.currentEntryIndex}
          />
        </GridItem>
      ))}
      <Button
        variant="ghost"
        title="Next"
        disabled={!canGoRight}
        onClick={onNext}
      >
        <LuChevronRight />
      </Button>
    </Grid>
  ) : null;
}

function QuizzControl({
  state,
  isActive,
  onClick,
}: {
  state: IQuizzEntryState;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={isActive ? "solid" : "outline"}
      onClick={onClick}
      colorPalette={
        state.givenUp
          ? "yellow"
          : state.resolved
          ? "green"
          : state.attempts > 0
          ? "red"
          : undefined
      }
    >
      {state.attempts > 0 ? state.attempts : ""}
    </Button>
  );
}
