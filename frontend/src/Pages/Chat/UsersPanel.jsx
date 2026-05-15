import { useMemo, useState } from "react";
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

import {
  acceptChatRequest,
  cancelChatRequest,
  declineChatRequest,
  sendChatRequest,
} from "./chatApi";

const tabs = [
  { labelKey: "all", value: "all" },
  { labelKey: "allowed", value: "allowed" },
  { labelKey: "pending", value: "pending" },
];

const chatColors = {
  green: "#639C50",
  greenDark: "#3E7929",
  greenLight: "#DFF3D8",

  darkPanel: "#18211B",
  darkCard: "#202B24",

  lightPanel: "rgba(255, 255, 255, 0.96)",
  lightCard: "#FFFFFF",
  lightHover: "#F3FAEF",

  borderDark: "rgba(99, 156, 80, 0.35)",
  borderLight: "rgba(62, 121, 41, 0.22)",
};

export default function UsersPanel({
  users,
  type,
  loading,
  onChangeType,
  onRefresh,
  onOpenChat,
}) {
  const [search, setSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");

  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const isDark = colorMode === "dark";

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const value = `${user.username || ""} ${user.email || ""} ${
        user.full_name || ""
      }`.toLowerCase();

      return value.includes(search.toLowerCase());
    });
  }, [users, search]);

  const runAction = async (id, callback) => {
    try {
      setError("");
      setActionLoadingId(id);

      const result = await callback();
      await onRefresh();
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderAction = (user) => {
    if (user.chat_status === "allowed") {
      return (
        <Button
          size="xs"
          bg={chatColors.green}
          color="white"
          _hover={{ bg: chatColors.greenDark }}
          onClick={() => onOpenChat(user.chat_id)}
        >
          {t("open")}
        </Button>
      );
    }

    if (user.chat_status === "request_sent") {
      return (
        <Button
          size="xs"
          variant="outline"
          colorPalette="red"
          loading={actionLoadingId === user.id}
          onClick={() =>
            runAction(user.id, () => cancelChatRequest(user.request_id))
          }
        >
          {t("cancel")}
        </Button>
      );
    }

    if (user.chat_status === "request_received") {
      return (
        <HStack gap="2">
          <Button
            size="xs"
            bg={chatColors.green}
            color="white"
            _hover={{ bg: chatColors.greenDark }}
            loading={actionLoadingId === user.id}
            onClick={() => {
              runAction(user.id, () => acceptChatRequest(user.request_id)).then(
                (result) => {
                  if (result?.chat?.id) {
                    setTimeout(() => onOpenChat(result.chat.id), 500);
                  }
                }
              );
            }}
          >
            {t("accept")}
          </Button>

          <Button
            size="xs"
            variant="outline"
            colorPalette="red"
            disabled={actionLoadingId === user.id}
            onClick={() =>
              runAction(user.id, () => declineChatRequest(user.request_id))
            }
          >
            {t("no")}
          </Button>
        </HStack>
      );
    }

    return (
      <Button
        size="xs"
        bg={chatColors.green}
        color="white"
        _hover={{ bg: chatColors.greenDark }}
        loading={actionLoadingId === user.id}
        onClick={() => runAction(user.id, () => sendChatRequest(user.id))}
      >
        {t("write")}
      </Button>
    );
  };

  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      bg={isDark ? chatColors.darkPanel : chatColors.lightPanel}
      color={isDark ? "white" : "gray.800"}
    >
      <Box
        p="4"
        borderBottom="1px solid"
        borderColor={isDark ? chatColors.borderDark : chatColors.borderLight}
        bg={isDark ? "rgba(99, 156, 80, 0.08)" : "rgba(99, 156, 80, 0.08)"}
      >
        <HStack justify="space-between" mb="3">
          <Text fontSize="lg" fontWeight="bold">
            {t("users")}
          </Text>

          <Badge colorPalette="green">{filteredUsers.length}</Badge>
        </HStack>

        <HStack mb="3" gap="2">
          {tabs.map((tab) => {
            const isActive = type === tab.value;

            return (
              <Button
                key={tab.value}
                size="xs"
                variant={isActive ? "solid" : "outline"}
                bg={isActive ? chatColors.green : "transparent"}
                color={
                  isActive
                    ? "white"
                    : isDark
                      ? chatColors.greenLight
                      : chatColors.greenDark
                }
                borderColor={
                  isDark ? chatColors.borderDark : chatColors.borderLight
                }
                _hover={{
                  bg: isActive
                    ? chatColors.greenDark
                    : isDark
                      ? "rgba(99, 156, 80, 0.16)"
                      : chatColors.lightHover,
                }}
                onClick={() => onChangeType(tab.value)}
              >
                {t(tab.labelKey)}
              </Button>
            );
          })}
        </HStack>

        <Input
          size="sm"
          placeholder={t("searchUser")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg={isDark ? chatColors.darkCard : "#F7FBF5"}
          borderColor={isDark ? chatColors.borderDark : chatColors.borderLight}
          color={isDark ? "white" : "gray.800"}
          _placeholder={{
            color: isDark ? "gray.400" : "gray.500",
          }}
          _focus={{
            borderColor: chatColors.green,
            boxShadow: `0 0 0 1px ${chatColors.green}`,
          }}
        />

        {error && (
          <Text color={isDark ? "red.300" : "red.500"} fontSize="xs" mt="2">
            {error}
          </Text>
        )}
      </Box>

      <Box flex="1" overflowY="auto" p="3">
        {loading ? (
          <Box py="8" textAlign="center">
            <Spinner color="green.400" />
          </Box>
        ) : (
          <VStack align="stretch" gap="2">
            {filteredUsers.map((user) => (
              <Box
                key={user.id}
                p="3"
                borderRadius="xl"
                border="1px solid"
                borderColor={
                  isDark ? chatColors.borderDark : chatColors.borderLight
                }
                bg={isDark ? chatColors.darkCard : chatColors.lightCard}
                boxShadow="sm"
                _hover={{
                  bg: isDark
                    ? "rgba(99, 156, 80, 0.16)"
                    : chatColors.lightHover,
                  borderColor: chatColors.green,
                }}
              >
                <HStack justify="space-between" align="center">
                  <HStack minW="0">
                    <Box
                      w="36px"
                      h="36px"
                      borderRadius="full"
                      bg={
                        isDark
                          ? "rgba(99, 156, 80, 0.35)"
                          : chatColors.greenLight
                      }
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      color={
                        isDark ? chatColors.greenLight : chatColors.greenDark
                      }
                      flexShrink="0"
                      border="1px solid"
                      borderColor={
                        isDark ? chatColors.borderDark : chatColors.borderLight
                      }
                    >
                      {user.full_name?.[0]?.toUpperCase() || "U"}
                    </Box>

                    <Box minW="0">
                      <Text fontWeight="semibold" truncate>
                        {user.full_name || t("user")}
                      </Text>

                      <Text
                        fontSize="xs"
                        color={isDark ? "gray.400" : "gray.500"}
                        truncate
                      >
                        {user.email || user.username}
                      </Text>
                    </Box>
                  </HStack>

                  {renderAction(user)}
                </HStack>
              </Box>
            ))}

            {!filteredUsers.length && (
              <Text
                color={isDark ? "gray.400" : "gray.500"}
                textAlign="center"
                py="8"
              >
                {t("nothingFound")}
              </Text>
            )}
          </VStack>
        )}
      </Box>
    </Box>
  );
}
