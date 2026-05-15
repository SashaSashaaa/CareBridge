import React from "react";
import { Box, Heading, Image, Text, Flex, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "../../components/ui/color-mode";
import { useDeleteStoryMutation } from "../../Store/services/profile";
import { useGetUserQuery } from "../../Store/services/user";
import { useTranslation } from "react-i18next";

export default function StoryCard({ data: story }) {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { t } = useTranslation();

  const token = localStorage.getItem("access");

  const [deleteStory] = useDeleteStoryMutation();

  const { data: currentUser } = useGetUserQuery(undefined, {
    skip: !token,
  });

  const isOwner =
    currentUser?.id && story?.user?.id
      ? currentUser.id === story.user.id
      : false;

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Ви точно хочете видалити цю історію?",
    );

    if (!confirmDelete) return;

    await deleteStory(story.id).unwrap();
    navigate("/stories");
  };

  return (
    <Box
      bg={colorMode === "dark" ? "gray.800" : "gray.100"}
      transition="0.4s"
      w="100%"
      minW={0}
      _hover={{
        bg: colorMode === "dark" ? "gray.900" : "gray.200",
        transform: "translateY(-4px)",
      }}
      p={4}
      borderRadius={20}
      boxShadow="var(--shadow-color)"
      className="card"
    >
      <Heading textAlign="center" minH="60px" size="lg" mb={3} lineClamp="2">
        {story?.name}
      </Heading>

      <Image
        src={story?.thumbnail || story?.image}
        maxH="750px"
        w="50%"
        h="50%"
        objectFit="cover"
        mx="auto"
        borderRadius={15}
        mb={3}
      />

      <Text fontSize="sm" color="gray.500" mb={2}>
        Автор: {story?.user?.first_name || story?.user?.username}{" "}
        {story?.user?.last_name}
      </Text>

      <Text fontSize="lg" whiteSpace="normal" overflow="visible">
        {story?.description
          ? story.description.replace(/<[^>]*>/g, "")
          : "Опис відсутній"}
      </Text>

      {isOwner && (
        <Flex gap={3} mt={5}>
          <Button
            bg="var(--main-color)"
            color="white"
            borderRadius="xl"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/stories/${story.id}/edit`);
            }}
          >
            {t("edit")}
          </Button>

          <Button colorScheme="red" borderRadius="xl" onClick={handleDelete}>
            {t("delete")}
          </Button>
        </Flex>
      )}
    </Box>
  );
}
