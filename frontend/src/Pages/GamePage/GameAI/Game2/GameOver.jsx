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
          <Heading size="lg">{t("travelGameOverTitle")}</Heading>

          <Text fontSize="lg">
            {t("travelGameOverContributionStart")}{" "}
            <Text as="span" fontWeight="bold">
              {t("travelGameOverVolunteer")}
            </Text>
            .
          </Text>

          <Text>{t("travelGameOverDescription")}</Text>

          <Text>
            {t("travelGameOverResultStart")}{" "}
            <Text as="span" fontWeight="bold">
              {t("travelGameOverStrongResults")}
            </Text>
            .
          </Text>

          <Box
            p="4"
            bg={isDark ? "gray.700" : "gray.50"}
            borderRadius="md"
            border="1px solid"
            borderColor={isDark ? "gray.600" : "gray.200"}
            w="100%"
          >
            <Text whiteSpace="pre-line">
              📊{" "}
              <Text as="span" fontWeight="bold">
                {t("yourContribution")}
              </Text>
              {"\n\n"}
              {result.report}
            </Text>
          </Box>

          <Text fontWeight="bold" fontSize="lg">
            {t("travelGameOverGoodJob")}
          </Text>

          <Text>{t("travelGameOverContinueGood")}</Text>

          <Text fontSize="sm" color={isDark ? "gray.400" : "gray.500"}>
            {t("travelGameOverTogether")}
          </Text>
        </VStack>
      </Card.Root>
    </Box>
  );
};

export default GameOver;
