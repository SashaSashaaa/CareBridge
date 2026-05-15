import {
  Badge,
  Box,
  Button,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
 
import { useTranslation } from "react-i18next";
import { useColorMode } from "../../components/ui/color-mode";
 
import { deleteChat } from "./chatApi";
import { FaTrashAlt } from "react-icons/fa";
 
export default function ChatsPanel({
  chats,
  loading,
  selectedChatId,
  onSelectChat,
  onRefresh,
}) {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
 
  const isDark = colorMode === "dark";
 
  const chatColors = {
    green: "#639C50",
    greenDark: "#3E7929",
    greenLight: "#DFF3D8",
 
    darkPanel: "#18211B",
    darkCard: "#202B24",
 
    borderDark: "rgba(99, 156, 80, 0.35)",
    borderLight: "rgba(62, 121, 41, 0.22)",
  };
 
  const handleDeleteChat = async (chatId) => {
    await deleteChat(chatId);
    if (selectedChatId === chatId) {
      onSelectChat(null);
    }
    await onRefresh();
  };
 
  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      bg={isDark ? chatColors.darkPanel : "rgba(255, 255, 255, 0.96)"}
      color={isDark ? "white" : "gray.800"}
    >
      <Box
        p="4"
        borderBottom="1px solid"
        borderColor={isDark ? chatColors.borderDark : chatColors.borderLight}
        bg={isDark ? "rgba(99, 156, 80, 0.08)" : "rgba(99, 156, 80, 0.08)"}
      >
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold">
            {t("myChats")}
          </Text>
          <Badge colorPalette="green">{chats.length}</Badge>
        </HStack>
      </Box>
 
      <Box flex="1" overflowY="auto" p="3">
        {loading ? (
          <Box py="8" textAlign="center">
            <Spinner color="green.400" />
          </Box>
        ) : (
          <VStack align="stretch" gap="2">
            {chats.map((chat) => {
              const isActive = selectedChatId === chat.id;
              const otherUser = chat.other_user;
              const lastMessage = chat.last_message;
 
              return (
                <Box
                  key={chat.id}
                  p="3"
                  borderRadius="xl"
                  cursor="pointer"
                  bg={
                    isActive
                      ? isDark
                        ? "rgba(99, 156, 80, 0.32)"
                        : chatColors.greenLight
                      : isDark
                      ? chatColors.darkCard
                      : "white"
                  }
                  border="1px solid"
                  borderColor={
                    isActive
                      ? chatColors.green
                      : isDark
                      ? chatColors.borderDark
                      : chatColors.borderLight
                  }
                  boxShadow={isActive ? "0 0 0 1px rgba(99, 156, 80, 0.35)" : "sm"}
                  _hover={{
                    bg: isActive
                      ? isDark
                        ? "rgba(99, 156, 80, 0.38)"
                        : chatColors.greenLight
                      : isDark
                      ? "rgba(99, 156, 80, 0.16)"
                      : "#F3FAEF",
                    borderColor: chatColors.green,
                  }}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <HStack justify="space-between" align="start">
                    <HStack minW="0" align="start">
                      <Box
                        w="40px"
                        h="40px"
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
                        color={isDark ? chatColors.greenLight : chatColors.greenDark}
                        flexShrink="0"
                        border="1px solid"
                        borderColor={
                          isDark ? chatColors.borderDark : chatColors.borderLight
                        }
                      >
                        {otherUser?.full_name?.[0]?.toUpperCase() || "U"}
                      </Box>
 
                      <Box minW="0">
                        <Text fontWeight="bold" truncate>
                          {otherUser?.full_name || t("user")}
                        </Text>
                        <Text
                          fontSize="sm"
                          color={isDark ? "gray.400" : "gray.500"}
                          truncate
                        >
                          {lastMessage?.text || t("noMessages")}
                        </Text>
                      </Box>
                    </HStack>
 
                    <VStack gap="2" align="end">
                      {chat.unread_count > 0 && (
                        <Badge colorPalette="orange" p="10px" borderRadius="full" fontSize="lg">
                          {chat.unread_count}
                        </Badge>
                      )}
 
                      <Button
                        size="xs"
                        variant="ghost"
                        colorPalette="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(chat.id);
                        }}
                      >
                        <FaTrashAlt />
                      </Button>
                    </VStack>
                  </HStack>
                </Box>
              );
            })}
 
            {!chats.length && (
              <Text
                color={isDark ? "gray.400" : "gray.500"}
                textAlign="center"
                py="8"
              >
                {t("noChatsYet")}
              </Text>
            )}
          </VStack>
        )}
      </Box>
    </Box>
  );
}


