import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useColorMode } from "../ui/color-mode";

export default function TopBar({ mode, switchMode, points }) {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const isDark = colorMode === "dark";

  return (
    <Box
      position="absolute"
      top="0"
      left="calc(50vw - 150px)"
      width="280px"
      px="6"
      py="1"
      bg={isDark ? "gray.800" : "white"}
      color={isDark ? "white" : "gray.800"}
      borderBottomLeftRadius="40px"
      borderBottomRightRadius="40px"
      border="1px solid"
      borderColor={isDark ? "gray.600" : "black"}
      boxShadow={isDark ? "dark-lg" : "md"}
    >
      <HStack justify="center" gap="3">
        <Button
          size="sm"
          variant={!mode ? "solid" : "outline"}
          colorPalette="green"
          onClick={() => {
            if (mode) switchMode();
          }}
        >
          {t("quiz")}
        </Button>

        <Button
          size="sm"
          variant={mode ? "solid" : "outline"}
          colorPalette="green"
          onClick={() => {
            if (!mode) switchMode();
          }}
        >
          {t("gameTopBar")}
        </Button>

        <Text fontSize="3xl" fontWeight="bold" color="blue.400">
          {points}₿
        </Text>
      </HStack>
    </Box>
  );
}