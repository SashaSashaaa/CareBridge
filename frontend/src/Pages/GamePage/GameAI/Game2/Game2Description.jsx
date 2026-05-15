import { Button, Text, VStack, Box } from "@chakra-ui/react";
import { useColorMode } from "../../../../components/ui/color-mode";
import { useTranslation } from "react-i18next";

export default function GameTravelDescription({ isOpen, onClose }) {
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
          color="blue.500"
          textAlign={{ base: "center", md: "left" }}
        >
          {t("travelDescriptionTitle")}
        </Text>

        <VStack align="start" gap={{ base: 2.5, md: 3 }}>
          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("travelDescriptionIntro")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("travelDescriptionTask")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("travelDirectionDestinations")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("travelDirectionComfort")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("travelDirectionExperience")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("travelRoundDescription")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("travelDecisionsDepend")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("travelCompanyProfit")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("travelTouristRating")}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={textColor}>
            {t("travelBalanceText")}
          </Text>

          <Text fontSize={{ base: "xs", md: "sm" }} lineHeight="1.6" color={isDark ? "gray.400" : "gray.500"}>
            {t("travelReportHint")}
          </Text>
        </VStack>

        <Button
          mt={5}
          w="100%"
          colorPalette="blue"
          borderRadius="xl"
          fontWeight="bold"
          onClick={onClose}
        >
          {t("ok")}
        </Button>
      </Box>
    </Box>
  );
}