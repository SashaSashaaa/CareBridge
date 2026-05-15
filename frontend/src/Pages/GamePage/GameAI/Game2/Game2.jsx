import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Card,
  Spinner,
} from "@chakra-ui/react";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

import { useColorMode } from "../../../../components/ui/color-mode";

import GameOver from "./GameOver";
import ImgTravel from "./travel.jpg";
import Counter from "../../../../components/Counter";

export default function TravelGame({ points, setPoints }) {
  const [dest, setDest] = useState(0);
  const [comfort, setComfort] = useState(0);
  const [exp, setExp] = useState(0);

  const [result, setResult] = useState([]);
  const [gameOverData, setGameOverData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const isDark = colorMode === "dark";

  const send = async () => {
    if (points - dest - comfort - exp < 0) {
      enqueueSnackbar(t("notEnoughPointsTravel"), {
        variant: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8000/api/games/round_game_travel/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dest, comfort, exp }),
        },
      );

      const data = await res.json();

      setResult((prev) => [data, ...prev]);
      setPoints(points - dest - comfort - exp);

      if (data.game_over) {
        setGameOverData(data);
      }

      setDest(0);
      setComfort(0);
      setExp(0);
    } catch (err) {
      console.error(err);

      enqueueSnackbar(t("requestError"), {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const remaining = points - dest - comfort - exp;

  return (
    <>
      <Box
        background={`linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url(${ImgTravel})`}
        minH="100dvh"
        h="auto"
        backgroundPosition="center"
        backgroundSize="cover"
        position="relative"
        color={isDark ? "white" : "gray.800"}
        pt={{ base: "95px", md: "105px" }}
        pb={{ base: 8, md: 10 }}
        overflowY="auto"
      >
        {loading && (
          <Box
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bg="rgba(0,0,0,0.6)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex="10"
            flexDirection="column"
          >
            <Spinner size="xl" color="white" />

            <Text mt={3} color="white">
              {t("planningTrip")}
            </Text>
          </Box>
        )}

        <Box px={{ base: 3, sm: 4, md: 6 }} maxW="1000px" mx="auto">
          <VStack gap={{ base: 4, md: 5 }} align="stretch">
            <Card.Root
              p={{ base: 3, sm: 4, md: 5 }}
              borderRadius="2xl"
              bg={isDark ? "gray.800" : "white"}
              color={isDark ? "white" : "gray.800"}
              border="1px solid"
              borderColor={isDark ? "gray.700" : "gray.200"}
              boxShadow="xl"
            >
              <VStack gap="4">
                <Heading
                  size="lg"
                  textAlign="center"
                  bg={isDark ? "gray.700" : "gray.50"}
                  color={isDark ? "white" : "gray.800"}
                  p={2}
                  borderRadius="md"
                  w="100%"
                >
                  {t("travelManagerTitle")} {points}
                </Heading>

                <Counter
                  label={t("destinationsCounter")}
                  value={dest}
                  max={points}
                  onChange={setDest}
                />

                <Counter
                  label={t("comfortCounter")}
                  value={comfort}
                  max={points}
                  onChange={setComfort}
                />

                <Counter
                  label={t("experienceCounter")}
                  value={exp}
                  max={points}
                  onChange={setExp}
                />

                <Text
                  color={
                    remaining < 0 ? "red.500" : isDark ? "gray.300" : "gray.600"
                  }
                >
                  {t("remaining")}: {remaining}
                </Text>

                <Button
                  colorPalette="blue"
                  size="lg"
                  onClick={send}
                  disabled={remaining < 0 || loading}
                >
                  {t("startTour")}
                </Button>
              </VStack>
            </Card.Root>

            <Box
              maxH={{ base: "none", md: "48vh" }}
              overflowY={{ base: "visible", md: "auto" }}
              pr={{ base: 0, md: 2 }}
            >
              {result.map((r, i) => (
                <Card.Root
                  p={{ base: 3, sm: 4, md: 5 }}
                  borderRadius="2xl"
                  key={i}
                  mb="4"
                  bg={isDark ? "gray.800" : "white"}
                  color={isDark ? "white" : "gray.800"}
                  border="1px solid"
                  borderColor={isDark ? "gray.700" : "gray.200"}
                  boxShadow="md"
                >
                  <VStack align="start" gap="3">
                    <Heading size="md">
                      {t("round")} {r.round} {r.game_over ? "🏁" : ""}
                    </Heading>

                    <HStack
                      wrap="wrap"
                      gap={{ base: 2, md: 4 }}
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      <Text>🌍 {r.place}</Text>
                      <Text>🌦 {r.season}</Text>
                    </HStack>

                    <HStack
                      wrap="wrap"
                      gap={{ base: 2, md: 4 }}
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      <Text>
                        💰 {t("profit")}: {r.profit}
                      </Text>

                      <Text>
                        ⭐ {t("rating")}: {r.rating}
                      </Text>
                    </HStack>

                    <HStack
                      wrap="wrap"
                      gap={{ base: 2, md: 4 }}
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      <Text>
                        📈 {t("totalProfit")}: {r.total_profit}
                      </Text>

                      <Text>
                        ⭐ {t("averageRating")}: {r.avg_rating}
                      </Text>
                    </HStack>

                    <Box w="100%">
                      <Heading size="sm">{t("progress")}</Heading>

                      <VStack align="start" gap="2" mt={2}>
                        <Text>
                          {t("destinations")}:{" "}
                          {r.progress.destinations.progress}/
                          {r.progress.destinations.max}
                        </Text>

                        <Text>
                          {t("comfort")}: {r.progress.comfort.progress}/
                          {r.progress.comfort.max}
                        </Text>

                        <Text>
                          {t("experience")}: {r.progress.experience.progress}/
                          {r.progress.experience.max}
                        </Text>
                      </VStack>
                    </Box>

                    <Box w="100%">
                      <Heading size="sm">{t("report")}</Heading>

                      <Box
                        p="3"
                        mt="2"
                        bg={isDark ? "gray.700" : "gray.50"}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={isDark ? "gray.600" : "gray.200"}
                      >
                        <Text whiteSpace="pre-line">{r.report}</Text>
                      </Box>
                    </Box>
                  </VStack>
                </Card.Root>
              ))}
            </Box>
          </VStack>
        </Box>
      </Box>

      {gameOverData && <GameOver result={gameOverData} />}
    </>
  );
}
