import type { Metadata, Viewport } from "next";
import { Provider } from "@/components/ui/provider";
import { Box, Container, Flex, Link, Text } from "@chakra-ui/react";
import { LuGithub } from "react-icons/lu";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Guess the TV show",
  description: "Listen to the soundtrack and guess the TV series",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ WebkitTextSizeAdjust: "100%" }}
    >
      <body>
        <Provider>
          <Container maxW="lg">
            <Flex direction="column" p="3" pt="9" pb="9" minH="vh">
              {children}
              <Box flexGrow="1"></Box>
              <Flex
                as="footer"
                alignItems="center"
                justifyContent="center"
                gap="3"
                mt="6"
              >
                <Link
                  href="https://github.com/davidballester/soundtrack-quizz"
                  target="_blank"
                >
                  <LuGithub />
                  <Text>David Ballester Mena</Text>
                </Link>
              </Flex>
            </Flex>
          </Container>
        </Provider>
      </body>
    </html>
  );
}
