import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Center,
  Button,
  Flex,
  Container,
} from "@chakra-ui/react";
import { useColorMode } from "../../components/ui/color-mode";
import { useNavigate, Navigate } from "react-router";
import { LuPlus } from "react-icons/lu";
import {
  useGetMyVolunteersQuery,
  useGetMyArticlesQuery,
  useGetMyStoriesQuery,
} from "../../Store/services/profile";
import { useGetUserQuery } from "../../Store/services/user";
import { useTranslation } from "react-i18next";
import AdsLayout from "../../components/ads/AdsLayout";
import VolunteerCard from "../VolunteerPage/VolunteerCard";
import ArticleCard from "../ArticlePage/ArticleCard";
import StoryCard from "../StoryPage/StoryCard";

export default function ProfilePage() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showArticleStatus, setShowArticleStatus] = useState(true);
  const [showVolunteerStatus, setShowVolunteerStatus] = useState(true);

  const token = localStorage.getItem("access");

  const { data } = useGetUserQuery(undefined, {
    skip: !token,
  });

  const { data: volunteersData } = useGetMyVolunteersQuery(undefined, {
    skip: !token,
  });

  const { data: articlesData } = useGetMyArticlesQuery(undefined, {
    skip: !token,
  });

  const { data: storiesData } = useGetMyStoriesQuery(undefined, {
    skip: !token,
  });

  const volunteers = volunteersData?.results || volunteersData || [];
  const articles = articlesData?.results || articlesData || [];
  const stories = storiesData?.results || storiesData || [];

  useEffect(() => {
    return () => {
      articles.forEach((item) => {
        if (item.moderated) {
          sessionStorage.setItem(`article_confirm_seen_${item.id}`, "true");
        }
      });
    };
  }, [articles]);

  useEffect(() => {
    return () => {
      volunteers.forEach((item) => {
        if (item.moderated) {
          sessionStorage.setItem(`volunteer_confirm_seen_${item.id}`, "true");
        }
      });
    };
  }, [volunteers]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("article_status_seen", "true");
      sessionStorage.setItem("volunteer_status_seen", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <AdsLayout justifyContent="center">
      <Container maxW="1200px" py={8}>
        <Flex
          justify="space-between"
          align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
          mb={8}
        >
          <Box>
            <Heading size="2xl" color={isDark ? "white" : "gray.800"} mb={2}>
              {t("profile")}
            </Heading>

            <Text color={isDark ? "gray.400" : "gray.600"}>
              {t("personalInfoAnd")}
            </Text>
          </Box>

          <Flex gap={3} flexWrap="wrap">
            <Button
              leftIcon={<LuPlus />}
              colorScheme="green"
              borderRadius="xl"
              bg="var(--main-color)"
              p={2}
              onClick={() => navigate("/stories/create")}
            >
              {t("addStory")}
            </Button>

            <Button
              leftIcon={<LuPlus />}
              colorScheme="green"
              borderRadius="xl"
              bg="var(--main-color)"
              p={2}
              onClick={() => navigate("/articles/create")}
            >
              {t("addArticle")}
            </Button>

            <Button
              leftIcon={<LuPlus />}
              colorScheme="green"
              borderRadius="xl"
              bg="var(--main-color)"
              p={2}
              onClick={() => navigate("/volunteers/create")}
            >
              {t("addVolunteering")}
            </Button>
          </Flex>
        </Flex>

        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr", lg: "1fr 2fr" }}
          gap={8}
        >
          <Box
            bg={isDark ? "gray.800" : "white"}
            border="1px solid"
            borderColor={isDark ? "gray.700" : "gray.200"}
            borderRadius="2xl"
            boxShadow="lg"
            p={8}
            h="fit-content"
          >
            <Heading size="lg" mb={6} color={isDark ? "white" : "gray.800"}>
              {t("yourInfo")}
            </Heading>

            <VStack align="stretch" gap={4}>
              <Box>
                <Text
                  fontSize="sm"
                  color={isDark ? "gray.400" : "gray.500"}
                  mb={1}
                >
                  {t("loginname")}
                </Text>
                <Text
                  fontSize="lg"
                  fontWeight="600"
                  color={isDark ? "white" : "gray.800"}
                >
                  {data?.username || "Не вказано"}
                </Text>
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  color={isDark ? "gray.400" : "gray.500"}
                  mb={1}
                >
                  {t("firstname")}
                </Text>
                <Text
                  fontSize="lg"
                  fontWeight="600"
                  color={isDark ? "white" : "gray.800"}
                >
                  {data?.first_name || "Не вказано"}
                </Text>
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  color={isDark ? "gray.400" : "gray.500"}
                  mb={1}
                >
                  {t("lastname")}
                </Text>
                <Text
                  fontSize="lg"
                  fontWeight="600"
                  color={isDark ? "white" : "gray.800"}
                >
                  {data?.last_name || "Не вказано"}
                </Text>
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  color={isDark ? "gray.400" : "gray.500"}
                  mb={1}
                >
                  {t("email")}
                </Text>
                <Text
                  fontSize="lg"
                  fontWeight="600"
                  color={isDark ? "white" : "gray.800"}
                  wordBreak="break-word"
                >
                  {data?.email || "Не вказано"}
                </Text>
              </Box>
            </VStack>
          </Box>

          <Box
            bg={isDark ? "gray.800" : "white"}
            border="1px solid"
            borderColor={isDark ? "gray.700" : "gray.200"}
            borderRadius="2xl"
            boxShadow="lg"
            p={8}
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Box>
                <Heading size="lg" color={isDark ? "white" : "gray.800"}>
                  {t("myVolunteering")}
                </Heading>
                <Text color={isDark ? "gray.400" : "gray.600"} mt={1}>
                  {t("total")} {volunteers.length}
                </Text>
              </Box>
            </Flex>

            {volunteers.length === 0 ? (
              <Center
                border="1px dashed"
                borderColor={isDark ? "gray.600" : "gray.300"}
                borderRadius="xl"
                py={16}
                mb={10}
              >
                <Button
                  bg="var(--main-color)"
                  p={2}
                  colorScheme="green"
                  borderRadius="xl"
                  onClick={() => navigate("/volunteers/create")}
                >
                  {t("addFirstVolu")}
                </Button>
              </Center>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={10}>
                {volunteers.map((item) => (
                  <VolunteerCard
                    key={item.id}
                    data={item}
                    showStatus={showVolunteerStatus}
                  />
                ))}
              </SimpleGrid>
            )}

            <Flex justify="space-between" align="center" mb={6}>
              <Box>
                <Heading size="lg" color={isDark ? "white" : "gray.800"}>
                  {t("myArticles")}
                </Heading>
                <Text color={isDark ? "gray.400" : "gray.600"} mt={1}>
                  {t("total")} {articles.length}
                </Text>
              </Box>
            </Flex>

            {articles.length === 0 ? (
              <Center
                border="1px dashed"
                borderColor={isDark ? "gray.600" : "gray.300"}
                borderRadius="xl"
                py={16}
              >
                <Button
                  bg="var(--main-color)"
                  p={2}
                  colorScheme="green"
                  borderRadius="xl"
                  onClick={() => navigate("/articles/create")}
                >
                  {t("addFirstArticle")}
                </Button>
              </Center>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                {articles.map((item) => (
                  <ArticleCard
                    key={item.id}
                    data={item}
                    showStatus={showArticleStatus}
                  />
                ))}
              </SimpleGrid>
            )}

            <Flex justify="space-between" align="center" mb={6} mt={4}>
              <Box>
                <Heading size="lg" color={isDark ? "white" : "gray.800"}>
                  {t("myStories")}
                </Heading>
                <Text color={isDark ? "gray.400" : "gray.600"} mt={1}>
                  {t("total")} {stories.length}
                </Text>
              </Box>
            </Flex>

            {stories.length === 0 ? (
              <Center
                border="1px dashed"
                borderColor={isDark ? "gray.600" : "gray.300"}
                borderRadius="xl"
                py={16}
                mb={10}
              >
                <Button
                  bg="var(--main-color)"
                  p={2}
                  colorScheme="green"
                  borderRadius="xl"
                  onClick={() => navigate("/stories/create")}
                >
                  {t("addFirstStory")}
                </Button>
              </Center>
            ) : (
              <SimpleGrid
                columns={{ base: 1, md: 2 }}
                mb={10}
                w="100%"
                alignItems="stretch"
              >
                {stories.map((item) => (
                  <StoryCard key={item.id} data={item} lineClamp={0.05} />
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Box>
      </Container>
    </AdsLayout>
  );
}
