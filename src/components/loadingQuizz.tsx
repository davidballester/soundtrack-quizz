import { EmptyState, VStack } from "@chakra-ui/react";
import { LuLoaderPinwheel } from "react-icons/lu";

export function LoadingQuizz() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <LuLoaderPinwheel />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>Loading</EmptyState.Title>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
