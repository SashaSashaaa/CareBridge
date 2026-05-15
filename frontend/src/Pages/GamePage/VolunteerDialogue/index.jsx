import { Box, Button, Text, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useColorMode } from "../../../components/ui/color-mode";

export default function VolunteerOverlay({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const isDark = colorMode === "dark";

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      bg={isDark ? "blackAlpha.900" : "blackAlpha.800"}
      zIndex="overlay"
    >
      <Flex
        direction="column"
        justify="center"
        align="center"
        h="full"
        color="white"
        textAlign="center"
        px={6}
      >
        <Button
          position="absolute"
          top="20px"
          right="20px"
          onClick={onClose}
          variant="ghost"
          color="white"
          _hover={{
            bg: "whiteAlpha.200",
          }}
        >
          ❌
        </Button>

        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          {t("volunteerOverlayTitle")}
        </Text>

        <Text mb={4} maxW="800px">
          {t("volunteerOverlayText1")}
        </Text>

        <Text mb={4} maxW="800px">
          {t("volunteerOverlayText2")}
        </Text>

        <Text mb={4} maxW="800px">
          {t("volunteerOverlayText3")}
        </Text>

        <Text mb={8} maxW="800px">
          {t("volunteerOverlayText4")}
        </Text>

        <Button colorPalette="teal" onClick={onClose}>
          {t("close")}
        </Button>
      </Flex>
    </Box>
  );
}