import React from "react";
import { Box, Text, Card, Heading, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useColorMode } from "../../../../components/ui/color-mode";

const GameOver = ({ result }) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const isDark = colorMode === "dark";

  if (!result) return null;

  return (
    <Box
      position="fixed"
      inset="0"
      w="100vw"
      h="100dvh"
      bg="blackAlpha.800"
      display="flex"
      alignItems={{ base: "flex-start", md: "center" }}
      justifyContent="center"
      zIndex="1000"
      overflowY="auto"
      px={{ base: 3, sm: 4 }}
      py={{ base: "90px", md: 8 }}
    >
      <Card.Root
        p={{ base: 4, sm: 5, md: 8 }}
        maxW="900px"
        w="100%"
        textAlign="center"
        bg={isDark ? "gray.800" : "white"}
        color={isDark ? "white" : "gray.800"}
        borderRadius="xl"
        boxShadow="xl"
        border="1px solid"
        borderColor={isDark ? "gray.700" : "gray.200"}
      >
        <VStack gap="5">
          <Heading size="lg">{t("game3OverTitle")}</Heading>

          <Text fontSize="lg">
            {t("game3OverThanksStart")}{" "}
            <Text as="span" fontWeight="bold">
              {t("game3OverVolunteerContributions")}
            </Text>{" "}
            {t("game3OverThanksEnd")}
          </Text>

          <Text>{t("game3OverDescription")}</Text>

          <Text>{t("game3OverBalanceText")}</Text>

          <Box
            p="4"
            bg={isDark ? "green.900" : "green.50"}
            borderRadius="md"
            border="1px solid"
            borderColor={isDark ? "green.700" : "green.200"}
            w="100%"
          >
            <Text whiteSpace="pre-line">
              📊{" "}
              <Text as="span" fontWeight="bold">
                {t("ecosystemImpact")}
              </Text>
              {"\n\n"}
              {result.report}
            </Text>
          </Box>

          <Text fontWeight="bold" fontSize="lg">
            {t("game3OverGoodJob")}
          </Text>

          <Text>{t("game3OverRealLife")}</Text>

          <Text fontSize="sm" color={isDark ? "gray.400" : "gray.500"}>
            {t("game3OverFuture")}
          </Text>
        </VStack>
      </Card.Root>
    </Box>
  );
};

export default GameOver;
