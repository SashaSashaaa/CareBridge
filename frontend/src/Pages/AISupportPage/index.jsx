import React, { useState, useEffect } from "react";
import { Box, Button, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSendMessageToAISupportMutation } from "../../Store/services/aisupport";
import { useGetUserQuery } from "../../Store/services/user";
import { useColorMode } from "../../components/ui/color-mode";
import { useTranslation } from "react-i18next";
import AdsLayout from "../../components/ads/AdsLayout";

export default function AISupportPage() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const navigate = useNavigate();

  const { data: userData, isLoading: isUserLoading } = useGetUserQuery();

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const { t } = useTranslation();

  const [sendMessageToAISupport, { isLoading }] =
    useSendMessageToAISupportMutation();

  const isAuthorized = !!userData && !isUserLoading;

  async function handleSend() {
    if (!isAuthorized) return;

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const historyToSend = [...chat];

    const userMessage = {
      sender: "user",
      text: trimmedMessage,
    };

    setChat((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      const response = await sendMessageToAISupport({
        message: trimmedMessage,
        history: historyToSend,
      }).unwrap();

      const aiMessage = {
        sender: "ai",
        text: response.reply || "Відповідь порожня",
      };

      setChat((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        sender: "ai",
        text:
          error?.data?.reply ||
          error?.data?.error ||
          "Сталася помилка при зверненні до чату",
      };

      setChat((prev) => [...prev, errorMessage]);
    }
  }

  useEffect(() => {
    document.documentElement.style.overflowY = "scroll";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflowY = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AdsLayout>
      <Heading
        fontFamily="inherit"
        fontSize="32px"
        textAlign="center"
        color={isDark ? "white" : "gray.800"}
      >
        {t("aiSupport")}
      </Heading>

      <Box maxW="80%" mx="auto" p={6}>
        <VStack
          align="stretch"
          gap={4}
          mb={6}
          minH="400px"
          maxH="60vh"
          overflowY="auto"
          p={4}
          border="1px solid"
          borderColor={isDark ? "gray.700" : "gray.200"}
          borderRadius="20px"
          bg="rgba(255, 255, 255, 0.06)"
          boxShadow="var(--shadow-color)"
          backdropFilter="blur(10px)"
        >
          {chat.length === 0 && (
            <Text color={isDark ? "gray.400" : "gray.500"}>
              {isAuthorized ? t("writeProblems") : t("aiSupportAuthRequired")}
            </Text>
          )}

          {chat.map((item, index) => (
            <Box
              key={index}
              alignSelf={item.sender === "user" ? "flex-end" : "flex-start"}
              maxW="75%"
              p={4}
              borderRadius="xl"
              bg={
                item.sender === "user"
                  ? isDark
                    ? "blue.700"
                    : "blue.100"
                  : isDark
                    ? "gray.800"
                    : "gray.50"
              }
              border="1px solid"
              borderColor={isDark ? "gray.700" : "gray.200"}
            >
              <Text whiteSpace="pre-wrap">{item.text}</Text>
            </Box>
          ))}
        </VStack>

        {isAuthorized ? (
          <VStack align="stretch" gap={3}>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("writeProblemsPlaceholder")}
              size="lg"
              bg="rgba(126, 126, 126, 0.3)"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              borderRadius="20px"
              p={5}
              boxShadow="var(--shadow-color)"
              backdropFilter="blur(10px)"
            />

            <Button
              bg="var(--main-color)"
              borderRadius="20px"
              p={2}
              onClick={handleSend}
              loading={isLoading}
              loadingText={t("sendingPlaceholder")}
              size="lg"
            >
              {t("sendBtn")}
            </Button>
          </VStack>
        ) : (
          <Button
            bg="var(--main-color)"
            borderRadius="20px"
            p={2}
            size="lg"
            w="100%"
            boxShadow="var(--shadow-color)"
            onClick={() => navigate("/signup")}
            loading={isUserLoading}
          >
            {t("signup")}
          </Button>
        )}
      </Box>
    </AdsLayout>
  );
}
