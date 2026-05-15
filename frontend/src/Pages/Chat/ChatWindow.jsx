import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useTranslation } from "react-i18next";
import { useColorMode } from "../../components/ui/color-mode";

import { getChatDetail, markMessagesAsRead } from "./chatApi";

import { useChatSocket } from "./useChatSocket";

import { LuSend } from "react-icons/lu";

export default function ChatWindow({ chatId, onRefreshChats, onChatNotFound }) {
  const bottomRef = useRef(null);

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const isDark = colorMode === "dark";

  const chatColors = {
    green: "#639C50",
    greenDark: "#3E7929",
    greenLight: "#DFF3D8",

    darkBg: "#101612",
    darkPanel: "#18211B",
    darkCard: "#202B24",

    borderDark: "rgba(99, 156, 80, 0.35)",
    borderLight: "rgba(62, 121, 41, 0.22)",
  };

  const loadChat = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getChatDetail(chatId);
      setChat(data);
      setMessages(data.messages || []);
      await markMessagesAsRead(chatId);
      if (onRefreshChats) await onRefreshChats();
    } catch (err) {
      setError(err.message);
      if (onChatNotFound) onChatNotFound();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatId) {
      loadChat();
    }
  }, [chatId]);

  const { isConnected, sendMessage, sendTyping, sendRead } = useChatSocket(
    chatId,
    async (event) => {
      if (event.type === "message") {
        setMessages((prev) => [...prev, event.data]);
        sendRead();
        if (onRefreshChats) {
          await onRefreshChats();
        }
      }

      if (event.type === "typing") {
        if (event.is_typing) {
          setTypingUser(event.username);
        } else {
          setTypingUser(null);
        }
      }

      if (event.type === "read") {
        if (onRefreshChats) {
          await onRefreshChats();
        }
      }
    },
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    const value = text.trim();

    if (!value) return;

    sendMessage(value);
    setText("");
    sendTyping(false);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);

    if (e.target.value.trim()) {
      sendTyping(true);
    } else {
      sendTyping(false);
    }
  };

  if (loading) {
    return (
      <Box
        h="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={isDark ? chatColors.darkBg : "#F4FAF2"}
      >
        <Spinner color="green.400" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        h="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={isDark ? chatColors.darkBg : "#F4FAF2"}
      >
        <Text color={isDark ? "red.300" : "red.500"}>{error}</Text>
      </Box>
    );
  }

  const otherUser = chat?.other_user;

  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      bg={isDark ? chatColors.darkBg : "#F4FAF2"}
      color={isDark ? "white" : "gray.800"}
    >
      <Box
        p="4"
        borderBottom="1px solid"
        borderColor={isDark ? chatColors.borderDark : chatColors.borderLight}
        bg={isDark ? chatColors.darkPanel : "white"}
      >
        <HStack justify="space-between">
          <HStack>
            <Box
              w="42px"
              h="42px"
              borderRadius="full"
              bg={isDark ? "rgba(99, 156, 80, 0.35)" : chatColors.greenLight}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
              color={isDark ? chatColors.greenLight : chatColors.greenDark}
              border="1px solid"
              borderColor={
                isDark ? chatColors.borderDark : chatColors.borderLight
              }
            >
              {otherUser?.full_name?.[0]?.toUpperCase() || "U"}
            </Box>

            <Box>
              <Text fontWeight="bold">{otherUser?.full_name || t("user")}</Text>

              <Text fontSize="xs" color={isDark ? "gray.400" : "gray.500"}>
                {otherUser?.email || otherUser?.username}
              </Text>
            </Box>
          </HStack>

          <Badge colorPalette={isConnected ? "green" : "red"}>
            {isConnected ? t("online") : t("offline")}
          </Badge>
        </HStack>

        {typingUser && (
          <Text
            mt="2"
            fontSize="xs"
            color={isDark ? "green.300" : chatColors.greenDark}
          >
            {t("userTyping", { user: typingUser })}
          </Text>
        )}
      </Box>

      <Box
        flex="1"
        overflowY="auto"
        p="4"
        bg={isDark ? chatColors.darkBg : "#F4FAF2"}
      >
        <VStack align="stretch" gap="3">
          {messages.map((message) => {
            const isMine = message.sender?.id !== otherUser?.id;

            return (
              <HStack
                key={message.id}
                justify={isMine ? "flex-end" : "flex-start"}
              >
                <Box
                  maxW="70%"
                  bg={
                    isMine
                      ? chatColors.green
                      : isDark
                        ? chatColors.darkCard
                        : "white"
                  }
                  color={isMine ? "white" : isDark ? "gray.100" : "gray.800"}
                  px="4"
                  py="2"
                  borderRadius="2xl"
                  borderBottomRightRadius={isMine ? "sm" : "2xl"}
                  borderBottomLeftRadius={isMine ? "2xl" : "sm"}
                  boxShadow={
                    isMine ? "0 6px 16px rgba(62, 121, 41, 0.28)" : "sm"
                  }
                  border="1px solid"
                  borderColor={
                    isMine
                      ? chatColors.greenDark
                      : isDark
                        ? chatColors.borderDark
                        : chatColors.borderLight
                  }
                >
                  <Text whiteSpace="pre-wrap">{message.text}</Text>

                  <Text fontSize="10px" opacity="0.75" textAlign="right" mt="1">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Box>
              </HStack>
            );
          })}

          <div ref={bottomRef} />
        </VStack>
      </Box>

      <Box
        p="4"
        // borderTop="1px solid"
        // borderColor={isDark ? chatColors.borderDark : chatColors.borderLight}
        // bg={isDark ? chatColors.darkPanel : "white"}
      >
        <HStack>
          <Input
            placeholder={t("writeMessage")}
            value={text}
            onChange={handleInputChange}
            onBlur={() => sendTyping(false)}
            bg={isDark ? chatColors.darkCard : "#F7FBF5"}
            borderColor={
              isDark ? chatColors.borderDark : chatColors.borderLight
            }
            color={isDark ? "white" : "gray.800"}
            _placeholder={{
              color: isDark ? "gray.400" : "gray.500",
            }}
            _focus={{
              borderColor: chatColors.green,
              boxShadow: `0 0 0 1px ${chatColors.green}`,
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            borderRadius="50px"
            p="10px"
            bg="rgba(255, 255, 255, 0.06)"
            backdropFilter="blur(10px)"
          />

          <Button
            bg={chatColors.green}
            color="white"
            _hover={{
              bg: chatColors.greenDark,
            }}
            _disabled={{
              opacity: 0.45,
              cursor: "not-allowed",
            }}
            onClick={handleSend}
            disabled={!isConnected || !text.trim()}
            borderRadius="100%"
          >
            <LuSend />
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
