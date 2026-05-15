import { Button, Text, VStack, Box, HStack, Badge } from "@chakra-ui/react";
import { useColorMode } from "../../../../components/ui/color-mode";
import { useTranslation } from "react-i18next";

export default function Game1Description({ isOpen, onClose }) {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();

  const isDark = colorMode === "dark";

  if (!isOpen) return null;

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
        borderRadius="2xl"
        p={{ base: 4, sm: 5, md: 6 }}
        bg={isDark ? "gray.800" : "gray.100"}
        color={isDark ? "white" : "gray.800"}
        maxW="720px"
        w="100%"
        boxShadow="xl"
        border="1px solid"
        borderColor={isDark ? "gray.700" : "gray.200"}
      >
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="bold"
          color="purple.500"
          mb={4}
          textAlign={{ base: "center", md: "left" }}
        >
          {t("game1DescriptionTitle")}
        </Text>

        <VStack align="start" gap={{ base: 3, md: 4 }}>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color={isDark ? "gray.300" : "gray.700"}
            lineHeight="1.6"
          >
            {t("game1DescriptionIntroStart")}{" "}
            <Text as="span" fontWeight="semibold" color="purple.500">
              {t("game1DescriptionRole")}
            </Text>
            .
          </Text>

          <Box>
            <Text fontWeight="bold" mb={1}>
              {t("game1TasksTitle")}
            </Text>

            <VStack align="start" gap={1} pl={{ base: 0, md: 3 }}>
              <Text fontSize={{ base: "sm", md: "md" }}>
                <Text as="span" fontWeight="semibold" color="green.500">
                  1.
                </Text>{" "}
                {t("game1TaskEarn")}
              </Text>

              <Text fontSize={{ base: "sm", md: "md" }}>
                <Text as="span" fontWeight="semibold" color="blue.500">
                  2.
                </Text>{" "}
                {t("game1TaskDistribute")}
              </Text>
            </VStack>
          </Box>

          <VStack align="stretch" gap={3} w="100%">
            <Box>
              <HStack justify="space-between" gap={3}>
                <Text fontWeight="medium">🤖 AI</Text>
                <Badge colorPalette="purple">0 / 20</Badge>
              </HStack>
              <Text
                mt={1}
                fontSize={{ base: "sm", md: "md" }}
                color={isDark ? "gray.300" : "gray.700"}
                lineHeight="1.6"
              >
                {t("game1AiDescription")}
              </Text>
            </Box>

            <Box>
              <HStack justify="space-between" gap={3}>
                <Text fontWeight="medium">{t("game1TransportTitle")}</Text>
                <Badge colorPalette="orange">0 / 20</Badge>
              </HStack>
              <Text
                mt={1}
                fontSize={{ base: "sm", md: "md" }}
                color={isDark ? "gray.300" : "gray.700"}
                lineHeight="1.6"
              >
                {t("game1TransportDescription")}
              </Text>
            </Box>

            <Box>
              <HStack justify="space-between" gap={3}>
                <Text fontWeight="medium">{t("game1EcoTitle")}</Text>
                <Badge colorPalette="green">0 / 20</Badge>
              </HStack>
              <Text
                mt={1}
                fontSize={{ base: "sm", md: "md" }}
                color={isDark ? "gray.300" : "gray.700"}
                lineHeight="1.6"
              >
                {t("game1EcoDescription")}
              </Text>
            </Box>
          </VStack>

          <Box>
            <Text
              fontWeight="semibold"
              color={isDark ? "gray.100" : "gray.800"}
              fontSize={{ base: "sm", md: "md" }}
            >
              {t("game1GoalTitle")}
            </Text>

            <Text
              color={isDark ? "gray.300" : "gray.600"}
              fontWeight="bold"
              fontSize={{ base: "sm", md: "md" }}
              lineHeight="1.6"
            >
              {t("game1GoalText")}
            </Text>
          </Box>

          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color={isDark ? "gray.400" : "gray.500"}
            lineHeight="1.6"
          >
            {t("game1ReportHint")}
          </Text>
        </VStack>

        <Button
          mt={5}
          w="100%"
          colorPalette="purple"
          borderRadius="xl"
          fontWeight="bold"
          onClick={onClose}
        >
          {t("startGame")}
        </Button>
      </Box>
    </Box>
  );
}