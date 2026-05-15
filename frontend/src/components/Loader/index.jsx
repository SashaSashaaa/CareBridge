"use client";

import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export function FullscreenLoader({ text = "Завантаження..." }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(media.matches);

    const listener = (e) => setIsDark(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  const bg = isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)";

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      bg={bg}
      backdropFilter="blur(10px)"
      zIndex="9999"
      align="center"
      justify="center"
    >
      <VStack gap={6}>
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.400" />
        <Text fontSize="lg">{text}</Text>
      </VStack>
    </Flex>
  );
}
