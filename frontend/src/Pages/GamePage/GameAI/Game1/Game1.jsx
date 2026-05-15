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

import ImgProgramming from "./programming.jpg";
import GameOver from "./GameOver";
import Counter from "../../../../components/Counter";

export default function Game1({ points, setPoints }) {
  const [ai, setAi] = useState(0);
  const [transport, setTransport] = useState(0);
  const [eco, setEco] = useState(0);

  const [result, setResult] = useState([]);
  const [gameOverData, setGameOverData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const isDark = colorMode === "dark";

  const send = async () => {
    if (points - ai - transport - eco < 0) {
      enqueueSnackbar(t("notEnoughPoints"), {
        variant: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/games/round_game1/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ai, transport, eco }),
      });

      const data = await res.json();

      setResult((prev) => [data, ...prev]);
      setPoints(points - ai - transport - eco);

      if (data.game_over) {
        setGameOverData(data);
      }

      setAi(0);
      setTransport(0);
      setEco(0);
    } catch (err) {
      console.error("Request error:", err);

      enqueueSnackbar(t("requestError"), {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const remaining = points - ai - transport - eco;

  return (
    <>
      <Box
        background={`linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url(${ImgProgramming})`}
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
            <Spinner size="xl" thickness="4px" color="white" />

            <Text mt={4} color="white" fontSize="lg">
              {t("processingRound")}
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
              <VStack align="stretch" gap="4">
                <Heading
                  size="lg"
                  textAlign="center"
                  bg={isDark ? "gray.700" : "gray.50"}
                  color={isDark ? "white" : "gray.800"}
                  p={2}
                  borderRadius="md"
                >
                  {t("controlPanel")} <b>{points}</b>💰
                </Heading>

                <Counter
                  label="🤖 AI"
                  value={ai}
                  max={points < 20 ? points : 20}
                  onChange={setAi}
                />

                <Counter
                  label="🚗 Transport"
                  value={transport}
                  max={points < 20 ? points : 20}
                  onChange={setTransport}
                />

                <Counter
                  label="🌱 Eco"
                  value={eco}
                  max={points < 20 ? points : 20}
                  onChange={setEco}
                />

                <Text
                  color={
                    remaining < 0 ? "red.500" : isDark ? "gray.300" : "gray.600"
                  }
                >
                  {t("remaining")}: {remaining}
                </Text>

                <Button
                  colorPalette="green"
                  size="lg"
                  onClick={send}
                  disabled={remaining < 0 || loading}
                >
                  {t("startRound")}
                </Button>
              </VStack>
            </Card.Root>

            <Box
              maxH={{ base: "none", md: "48vh" }}
              overflowY={{ base: "visible", md: "auto" }}
              pr={{ base: 0, md: 2 }}
            >
              {result.map((r, ind) => (
                <Card.Root
                  p={{ base: 3, sm: 4, md: 5 }}
                  borderRadius="2xl"
                  key={ind}
                  mb="4"
                  bg={isDark ? "gray.800" : "white"}
                  color={isDark ? "white" : "gray.800"}
                  border="1px solid"
                  borderColor={isDark ? "gray.700" : "gray.200"}
                  boxShadow="md"
                >
                  <VStack align="start" gap="3">
                    <Heading size="md">
                      {`${t("round")} ${r.round} ${
                        r.game_over ? `(${t("gameFinished")})` : ""
                      }`}
                    </Heading>

                    <HStack
                      wrap="wrap"
                      gap={{ base: 2, md: 4 }}
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      <Text>
                        <b>{t("income")}:</b> {r.income}
                      </Text>

                      <Text>
                        <b>{t("saving")}:</b> {r.saving}
                      </Text>

                      <Text>
                        <b>{t("totalIncome")}:</b> {r.total_income}
                      </Text>

                      <Text>
                        <b>{t("totalSaving")}:</b> {r.total_saving}
                      </Text>
                    </HStack>

                    <Box w="100%">
                      <Heading size="sm">{t("sectorsProgress")}</Heading>

                      <VStack align="start" gap="2" mt={2}>
                        <Text>
                          🤖 AI: {r.progress.ai.progress} / {r.progress.ai.max}{" "}
                          (+{r.last_ai})
                        </Text>

                        <Text>
                          🚗 Transport: {r.progress.transport.progress} /{" "}
                          {r.progress.transport.max} (+{r.last_transport})
                        </Text>

                        <Text>
                          🌱 Eco: {r.progress.eco.progress} /{" "}
                          {r.progress.eco.max} (+{r.last_eco})
                        </Text>
                      </VStack>
                    </Box>

                    <Box mt={3} w="100%">
                      <Heading size="sm">{t("report")}</Heading>

                      <Box
                        p="3"
                        mt="2"
                        bg={isDark ? "gray.700" : "gray.50"}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={isDark ? "gray.600" : "gray.200"}
                      >
                        <Text whiteSpace="pre-line">
                          {r.report
                            .replace(/AI/gi, "🤖 AI")
                            .replace(/Transport/gi, "🚗 Transport")
                            .replace(/Eco/gi, "🌱 Eco")}
                        </Text>
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
