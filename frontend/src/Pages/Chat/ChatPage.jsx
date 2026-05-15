import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  HStack,
  Text,
  Button,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";

import UsersPanel from "./UsersPanel";
import ChatsPanel from "./ChatsPanel";
import ChatWindow from "./ChatWindow";
import { useNotificationSocket } from "./useChatSocket";

import Navbar from "../../components/Navbar";

import { getChatUsers, getChats, getChatRequests } from "./chatApi";
import { useTranslation } from "react-i18next";

import { useColorMode } from "../../components/ui/color-mode";

export default function ChatPage() {
  const isMobileSize = useBreakpointValue({
    base: true,
    md: true,
    lg: false,
  });
  const [selectedChatId, setSelectedChatId] = useState(null);

  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);

  const [usersType, setUsersType] = useState("all");

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);

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

    borderDark: "rgba(80, 130, 63, 0.35)",
    borderLight: "rgba(62, 121, 41, 0.22)",
  };
  const getUserId = (user) => {
    return String(
      user?.id ||
        user?.user?.id ||
        user?.to_user?.id ||
        user?.from_user?.id ||
        "",
    );
  };

  const getRequestUserIds = (request) => {
    return [
      request?.user?.id,
      request?.from_user?.id,
      request?.to_user?.id,
      request?.sender?.id,
      request?.receiver?.id,
      request?.from_user_id,
      request?.to_user_id,
      request?.sender_id,
      request?.receiver_id,
    ]
      .filter(Boolean)
      .map(String);
  };

  const allowedUserIds = useMemo(() => {
    const ids = new Set();

    requests.forEach((request) => {
      const status = String(request?.status || "").toLowerCase();

      const isAllowed =
        status === "accepted" ||
        status === "approved" ||
        status === "allowed" ||
        request?.accepted === true ||
        request?.is_accepted === true ||
        request?.allowed === true ||
        request?.can_chat === true;

      if (isAllowed) {
        getRequestUserIds(request).forEach((id) => ids.add(id));
      }
    });

    return ids;
  }, [requests]);

  const isAllowedUser = (user) => {
    const status = String(
      user?.status || user?.request_status || "",
    ).toLowerCase();

    return (
      user?.can_chat === true ||
      user?.allowed === true ||
      user?.is_allowed === true ||
      user?.chat_allowed === true ||
      status === "accepted" ||
      status === "approved" ||
      status === "allowed" ||
      allowedUserIds.has(getUserId(user))
    );
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aAllowed = isAllowedUser(a);
      const bAllowed = isAllowedUser(b);

      if (aAllowed && !bAllowed) return -1;
      if (!aAllowed && bAllowed) return 1;

      return 0;
    });
  }, [users, allowedUserIds]);

  const loadUsers = useCallback(
    async (type = usersType) => {
      try {
        setLoadingUsers(true);
        setError("");
        const data = await getChatUsers(type);
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    },
    [usersType],
  );

  const loadChats = useCallback(async () => {
    try {
      setLoadingChats(true);
      setError("");
      const data = await getChats();
      setChats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingChats(false);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    try {
      const data = await getChatRequests("all");
      setRequests(data);
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadUsers(usersType), loadChats(), loadRequests()]);
  }, [loadUsers, loadChats, loadRequests, usersType]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleChangeUsersType = async (type) => {
    setUsersType(type);
    await loadUsers(type);
  };

  const handleNotification = useCallback(
    async (event) => {
      console.log("Notification:", event);

      switch (event.type) {
        case "request_received":
        case "request_cancelled":
        case "request_declined":
          await Promise.all([loadUsers(usersType), loadRequests()]);
          break;

        case "request_accepted":
          await Promise.all([
            loadUsers(usersType),
            loadChats(),
            loadRequests(),
          ]);
          break;

        case "new_message":
          await loadChats();
          break;

        default:
          await refreshAll();
      }
    },
    [loadUsers, loadChats, loadRequests, refreshAll, usersType],
  );

  useNotificationSocket(handleNotification);

  useEffect(() => {
    document.documentElement.style.overflowY = "scroll";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflowY = "";
      document.body.style.overflow = "";
    };
  }, []);
  return isMobileSize ? (
    <Box
      mx="10px"
      mt={{ base: "-70px", md: "-55px" }}
      h={{ base: "calc(100vh - 35px)", md: "calc(100vh - 50px)" }}
      bg={isDark ? chatColors.darkPanel : "rgba(255, 255, 255, 0.94)"}
      borderRadius="2xl"
      overflow="hidden"
      boxShadow={
        isDark
          ? "0 12px 35px rgba(0, 0, 0, 0.45)"
          : "0px 4px 8px rgba(46, 46, 46, 0.25)"
      }
      border="1px solid"
      borderColor={isDark ? chatColors.borderDark : chatColors.borderLight}
      display="flex"
      flexDirection="column"
    >
      {error && (
        <Box
          bg={isDark ? "rgba(120, 30, 30, 0.65)" : "red.50"}
          color={isDark ? "red.200" : "red.700"}
          p="2"
          fontSize="sm"
        >
          {error}
        </Box>
      )}

      {selectedChatId && (
        <Flex
          p="10px"
          gap="10px"
          align="center"
          borderBottom="1px solid"
          borderColor={isDark ? chatColors.borderDark : chatColors.borderLight}
          bg={isDark ? chatColors.darkPanel : "rgba(255, 255, 255, 0.96)"}
        >
          <Button
            h="40px"
            px="18px"
            borderRadius="full"
            bg={isDark ? "rgba(255,255,255,0.08)" : "green.50"}
            color={isDark ? "gray.100" : "green.700"}
            border="1px solid"
            borderColor={
              isDark ? chatColors.borderDark : chatColors.borderLight
            }
            onClick={() => setSelectedChatId(null)}
          >
            Назад
          </Button>

          <Text
            fontWeight="800"
            color={isDark ? "gray.100" : "gray.800"}
            fontSize="md"
          >
            Чат
          </Text>
        </Flex>
      )}

      <Box flex="1" minH="0" overflow="hidden">
        {selectedChatId ? (
          <Box h="100%" bg={isDark ? chatColors.darkBg : "#F4FAF2"}>
            <ChatWindow
              chatId={selectedChatId}
              onRefreshChats={loadChats}
              onChatNotFound={() => setSelectedChatId(null)}
            />
          </Box>
        ) : (
          <Box h="100%" overflow="hidden">
            <UsersPanel
              users={sortedUsers}
              type={usersType}
              loading={loadingUsers}
              onChangeType={handleChangeUsersType}
              onRefresh={refreshAll}
              onOpenChat={(chatId) => setSelectedChatId(chatId)}
            />
          </Box>
        )}
      </Box>
    </Box>
  ) : (
    <Box
      ml="10px"
      mr="10px"
      h="calc(85vh - 80px)"
      bg={isDark ? chatColors.darkPanel : "rgba(255, 255, 255, 0.94)"}
      borderRadius="2xl"
      overflow="hidden"
      boxShadow={
        isDark
          ? "0 12px 35px rgba(0, 0, 0, 0.45)"
          : "0px 4px 8px rgba(46, 46, 46, 0.25)"
      }
      border="1px solid"
      borderColor={isDark ? chatColors.borderDark : chatColors.borderLight}
    >
      {error && (
        <Box
          bg={isDark ? "rgba(120, 30, 30, 0.65)" : "red.50"}
          color={isDark ? "red.200" : "red.700"}
          p="2"
          fontSize="sm"
        >
          {error}
        </Box>
      )}

      <HStack h={error ? "calc(100% - 36px)" : "100%"} align="stretch" gap="0">
        <Box
          w="320px"
          borderRight="1px solid"
          borderColor={isDark ? chatColors.borderDark : chatColors.borderLight}
          overflow="hidden"
          bg={isDark ? chatColors.darkPanel : "rgba(255, 255, 255, 0.96)"}
        >
          <UsersPanel
            users={sortedUsers}
            type={usersType}
            loading={loadingUsers}
            onChangeType={handleChangeUsersType}
            onRefresh={refreshAll}
            onOpenChat={(chatId) => setSelectedChatId(chatId)}
          />
        </Box>

        <Box
          w="340px"
          borderRight="1px solid"
          borderColor={isDark ? chatColors.borderDark : chatColors.borderLight}
          overflow="hidden"
          bg={isDark ? chatColors.darkPanel : "rgba(255, 255, 255, 0.96)"}
        >
          <ChatsPanel
            chats={chats}
            loading={loadingChats}
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
            onRefresh={refreshAll}
          />
        </Box>

        <Box flex="1" minW="0" bg={isDark ? chatColors.darkBg : "#F4FAF2"}>
          {selectedChatId ? (
            <ChatWindow
              chatId={selectedChatId}
              onRefreshChats={loadChats}
              onChatNotFound={() => setSelectedChatId(null)}
            />
          ) : (
            <Box
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color={isDark ? "gray.400" : "gray.600"} fontSize="lg">
                {t("selectChatToStart")}
              </Text>
            </Box>
          )}
        </Box>
      </HStack>
    </Box>
  );
}
