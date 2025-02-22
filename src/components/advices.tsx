import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { LuLightbulb } from "react-icons/lu";

const advices = [
  "Use the arows to navigate back and forth between TV show",
  "Click the play button to listen to a few seconds of the TV show soundtrack",
];

export function Advices() {
  const [advice] = useState<string>(
    advices[Math.floor(Math.random() * advices.length)]
  );
  return (
    <Flex direction="row" gap="3">
      <LuLightbulb />
      <Text>{advice}</Text>
    </Flex>
  );
}
