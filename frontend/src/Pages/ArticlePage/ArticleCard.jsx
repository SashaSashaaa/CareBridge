import { Box, Heading, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "../../components/ui/color-mode";
import { useGetUserQuery } from "../../Store/services/user";

export default function ArticleCard({ data, showStatus = false }) {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const token = localStorage.getItem("access");
  const { data: currentUser } = useGetUserQuery(undefined, {
    skip: !token,
  });
  let isOwner = false;
  if (currentUser?.id) {
    isOwner = currentUser?.id === data?.user?.id;
  }

  return (
    <Box
      w={300}
      onClick={data.moderated ? () => navigate(`/articles/${data.id}`) : undefined}
      bg={colorMode === "dark" ? "gray.800" : "gray.100"}
      transition="0.4s"
      _hover={{
        bg: colorMode === "dark" ? "gray.900" : "gray.200",
        transform: "translateY(-4px)",
      }}
      p={4}
      borderRadius={20}
      cursor="pointer"
      boxShadow="var(--shadow-color)"
      className="card"
    >
      {showStatus && isOwner && !data.moderated && (
        <Text textAlign="center" fontWeight="800" mb={2} color="orange.400">
          Перевіряється
        </Text>
      )}

      {showStatus &&
        isOwner &&
        data.moderated &&
        !sessionStorage.getItem(`article_confirm_seen_${data.id}`) && (
          <Text textAlign="center" fontWeight="800" mb={2} color="green.500">
            Підтверджено
          </Text>
        )}

      <Heading textAlign="center" minH="60px" size="lg" mb={3} lineClamp="2">
        {data.name}
      </Heading>

      <Image
        src={data.thumbnail}
        h={200}
        w="100%"
        objectFit="cover"
        mx="auto"
        borderRadius={15}
        mb={3}
      />

      <Text fontSize="sm" color="gray.500" mb={2}>
        Автор: {data.user?.first_name || data.user?.username}{" "}
        {data.user?.last_name}
      </Text>

      <Text lineClamp="3">
        {data?.main_description
          ? data.main_description.replace(/<[^>]*>/g, "")
          : "Опис відсутній"}
      </Text>
    </Box>
  );
}
