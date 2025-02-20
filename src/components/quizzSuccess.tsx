import { Box } from "@chakra-ui/react";
import Confetti from "react-confetti";

export function QuizzSuccess() {
  return (
    <Box position="fixed" top="0" left="0" w="full" h="full" overflow="hidden">
      <Confetti recycle={false} />
      <audio src="/fanfare.mp3" style={{ visibility: "hidden" }} autoPlay />
    </Box>
  );
}
