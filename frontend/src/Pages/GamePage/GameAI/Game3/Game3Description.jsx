import { Button, Text, VStack, Box } from "@chakra-ui/react";
import { useColorMode } from "../../../../components/ui/color-mode";
import { useTranslation } from "react-i18next";

export default function Game3Description({ isOpen, onClose }) {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();

  const isDark = colorMode === "dark";

  if (!isOpen) return null;

  const textColor = isDark ? "gray.300" : "gray.700";

  return (
    <Box
      position="fixed"
      inset="0"
      w="100vw"
      h="100vh"
      bg="blackAlpha.700"
      display="flex"
      alignItems={{ base: "flex-start", md: "center" }}
      justifyContent="center"
      zIndex="overlay"
      overflowY="auto"
      px={{ base: 3, sm: 4 }}
      py={{ base: "90px", md: 8 }}
    >
      <Box
        bg={isDark ? "gray.800" : "gray.100"}
        color={isDark ? "white" : "gray.800"}
        borderRadius="2xl"
        p={{ base: 4, sm: 5, md: 6 }}
        maxW="720px"
        w="100%"
        boxShadow="xl"
        border="1px solid"
        borderColor={isDark ? "gray.700" : "gray.200"}
      >
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="bold"
          mb={4}
          color="green.500"
          textAlign={{ base: "center", md: "left" }}
        >
          {t("game3DescriptionTitle")}
        </Text>

        <VStack align="start" gap={{ base: 2.5, md: 3 }}>
          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("game3DescriptionIntro")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("game3DescriptionBalance")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("game3DistributeResources")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("game3PlantsDescription")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("game3WaterDescription")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("game3AutomationDescription")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("game3RandomEvents")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("game3ActionsMatter")}
          </Text>

          <Text fontSize={{ base: "xs", md: "sm" }} lineHeight="1.6" color={isDark ? "gray.400" : "gray.500"}>
            {t("game3FinalReport")}
          </Text>
        </VStack>

        <Button
          mt={5}
          w="100%"
          colorPalette="green"
          borderRadius="xl"
          fontWeight="bold"
          onClick={onClose}
        >
          {t("startFarmingGame")}
        </Button>
      </Box>
    </Box>
  );
}