"use client";

import { Quizz } from "@/components/quizz";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { LuRotateCcw } from "react-icons/lu";

export default function Home() {
  const [showTryAgain, setShowTryAgain] = useState<boolean>(false);
  return (
    <Flex direction="column" gap="6">
      <Box textAlign="center">
        <Text as="h2" textStyle="7xl">
          Guess the TV show!
        </Text>
      </Box>
      <Quizz length={3} onResolved={() => setShowTryAgain(true)} />
      <Flex justifyContent="center">
        <Button
          onClick={() => window.location.reload()}
          style={{
            opacity: showTryAgain ? 1 : 0,
            transition: "opacity 0.3s ease-out",
          }}
          size="2xl"
          colorPalette="yellow"
          variant="outline"
        >
          <LuRotateCcw /> Try again!
        </Button>
      </Flex>
    </Flex>
  );
}
