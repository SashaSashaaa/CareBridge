import React from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  Image,
  Flex,
  Button,
  Spinner,
  Center,
  VStack,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOneArticleQuery } from "../../Store/services/article";
import { useGetUserQuery } from "../../Store/services/user";
import { useDeleteArticleMutation } from "../../Store/services/profile";
import { useColorMode } from "../../components/ui/color-mode";
import { IoChevronBack } from "react-icons/io5";
import { useTranslation } from "react-i18next";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { t, i18n } = useTranslation();

  const { data, isLoading, isError, error } = useGetOneArticleQuery(id);

  const token = localStorage.getItem("access");

  const { data: currentUser } = useGetUserQuery(undefined, {
    skip: !token,
  });

  const [deleteVolunteer] = useDeleteArticleMutation();

  let isOwner = false;
  if (currentUser?.id) {
    isOwner = currentUser?.id === data?.user?.id;
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Ви точно хочете видалити цю статтю?");

    if (!confirmDelete) return;

    await deleteVolunteer(data.id).unwrap();
    navigate("/articles");
  };

  if (isLoading) {
    return (
      <Center minH="70vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Flex justify="center" py={8}>
      <Container maxW="1200px">
        <Flex
          justify="space-between"
          align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
          mb={8}
        >
          <Box>
            <Heading size="2xl" color={isDark ? "white" : "gray.800"} mb={2}>
              {data?.name || "Без назви"}
            </Heading>
            <Text color={isDark ? "gray.400" : "gray.600"}>
              {t("infoVolunteer")}
            </Text>
          </Box>

          <Button
            borderRadius="xl"
            onClick={() => navigate("/articles")}
            bg={isDark ? "gray.700" : "gray.200"}
            color={isDark ? "white" : "gray.800"}
            _hover={{
              bg: isDark ? "gray.600" : "gray.300",
            }}
          >
            <IoChevronBack />
          </Button>
        </Flex>

        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr", lg: "1.2fr 0.8fr" }}
          gap={8}
        >
          <Box
            bg={isDark ? "gray.800" : "white"}
            border="1px solid"
            borderColor={isDark ? "gray.700" : "gray.200"}
            borderRadius="2xl"
            boxShadow="lg"
            overflow="hidden"
          >
            <Image
              src={data?.thumbnail}
              alt={data?.name || "article"}
              w="100%"
              h={{ base: "240px", md: "380px", lg: "460px" }}
              objectFit="cover"
            />

            <Box p={{ base: 5, md: 8 }}>
              <Heading size="lg" color={isDark ? "white" : "gray.800"} mb={4}>
                {t("description")}
              </Heading>

              <Text
                color={isDark ? "gray.300" : "gray.600"}
                fontSize="md"
                lineHeight="1.8"
                whiteSpace="pre-line"
              >
                {data?.main_description
                  ? data.main_description.replace(/<[^>]*>/g, "")
                  : "Опис відсутній"}
              </Text>
            </Box>
          </Box>

          <VStack align="stretch" gap={6}>
            <Box
              bg={isDark ? "gray.800" : "white"}
              border="1px solid"
              borderColor={isDark ? "gray.700" : "gray.200"}
              borderRadius="2xl"
              boxShadow="lg"
              p={6}
            >
              <Heading size="md" color={isDark ? "white" : "gray.800"} mb={5}>
                {t("mainInfo")}
              </Heading>

              <VStack align="stretch" gap={4}>
                <Box>
                  <Text
                    fontSize="sm"
                    color={isDark ? "gray.400" : "gray.500"}
                    mb={1}
                  >
                    {t("name")}
                  </Text>
                  <Text
                    fontSize="lg"
                    fontWeight="600"
                    color={isDark ? "white" : "gray.800"}
                  >
                    {data?.name || "Не вказано"}
                  </Text>
                </Box>

                <Box>
                  <Text
                    fontSize="sm"
                    color={isDark ? "gray.400" : "gray.500"}
                    mb={1}
                  >
                    {t("description")}
                  </Text>
                  <Text
                    fontSize="md"
                    color={isDark ? "gray.200" : "gray.700"}
                    lineHeight="1.7"
                  >
                    {data?.description
                      ? data.description.replace(/<[^>]*>/g, "")
                      : "Не вказано"}
                  </Text>
                </Box>

                <Box>
                  <Text
                    fontSize="sm"
                    color={isDark ? "gray.400" : "gray.500"}
                    mb={1}
                  >
                    {t("createdat")}
                  </Text>
                  <Text
                    fontSize="md"
                    color={isDark ? "gray.200" : "gray.700"}
                    lineHeight="1.7"
                  >
                    {data?.created_at
                      ? new Date(data.created_at).toLocaleString("uk-UA")
                      : "Не вказано"}
                  </Text>
                </Box>

                <Box>
                  <Text
                    fontSize="sm"
                    color={isDark ? "gray.400" : "gray.500"}
                    mb={1}
                  >
                    {t("author")}
                  </Text>

                  <Text fontSize="md" color={isDark ? "white" : "gray.800"}>
                    {data?.user?.first_name || "Не вказано"}{" "}
                    {data?.user?.last_name || "Не вказано"}{" "}
                    {data?.user?.username || "Не вказано"}
                  </Text>
                  {isOwner && (
                    <Flex gap={3} mt={5}>
                      <Button
                        bg="var(--main-color)"
                        colorScheme="green"
                        borderRadius="xl"
                        onClick={() => navigate(`/articles/${data.id}/edit`)}
                      >
                        {t("edit")}
                      </Button>

                      <Button
                        colorScheme="red"
                        borderRadius="xl"
                        onClick={handleDelete}
                      >
                        {t("delete")}
                      </Button>
                    </Flex>
                  )}
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
}
