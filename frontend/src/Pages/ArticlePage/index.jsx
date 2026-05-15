import {
  Button,
  Flex,
  Box,
  Input,
  InputGroup,
  Heading,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useGetArticlesQuery } from "../../Store/services/article";
import ArticleCard from "./ArticleCard";
import { HStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { useSearchParams } from "react-router";
import { LuSearch } from "react-icons/lu";
import { useColorMode } from "../../components/ui/color-mode";
import { useTranslation } from "react-i18next";
import AdsLayout from "../../components/ads/AdsLayout";

export default function ArticlePage() {
  const { colorMode } = useColorMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const page = Number(searchParams.get("page")) || 1;
  const name = searchParams.get("name") || "";

  const [searchName, setSearchName] = useState(name);

  const { data, error, isLoading, isError } = useGetArticlesQuery({
    page,
    name,
  });

  return (
    <AdsLayout>
      {/* <Text
        color="red"
        fontSize="32px"
        fontWeight="bold"
        mt={5}
        mb={4}
        textAlign="center"
      >
        {t("thisSiteEtc")}
      </Text> */}

      <Box mt={6} mb={8} textAlign="center">
        <InputGroup
          mx="auto"
          h="58px"
          borderRadius="2xl"
          bg={
            colorMode === "dark"
              ? "rgba(255,255,255,0.08)"
              : "rgba(255,255,255,0.85)"
          }
          border="2px solid"
          borderColor={
            colorMode === "dark" ? "whiteAlpha.300" : "var(--main-color)"
          }
          boxShadow="0 10px 30px rgba(72, 187, 120, 0.18)"
          backdropFilter="blur(14px)"
          transition="0.25s"
          _focusWithin={{
            borderColor: "green.400",
            boxShadow:
              "0 0 0 4px rgba(72, 187, 120, 0.22), 0 14px 34px rgba(72, 187, 120, 0.28)",
            transform: "translateY(-2px)",
          }}
          startElement={
            <Box color="green.500" ml={3}>
              <LuSearch size={21} />
            </Box>
          }
          endElement={
            <Button
              h="44px"
              px={6}
              mr="7px"
              borderRadius="xl"
              bg="var(--main-color)"
              color="white"
              fontWeight="800"
              letterSpacing="0.3px"
              _hover={{
                bgGradient: "linear(to-r, green.400, green.700)",
                transform: "translateY(-1px)",
                boxShadow: "0 8px 18px rgba(56, 142, 60, 0.35)",
              }}
              _active={{ transform: "scale(0.96)" }}
              transition="0.2s"
              onClick={() => {
                const params = { page: "1" };

                if (searchName.trim()) {
                  params.name = searchName.trim();
                }

                setSearchParams(params);
              }}
            >
              {t("search")}
            </Button>
          }
        >
          <Input
            h="100%"
            pl={4}
            pr="125px"
            border="none"
            outline="none"
            fontSize="15px"
            fontWeight="600"
            color={colorMode === "dark" ? "white" : "gray.700"}
            _placeholder={{
              color: colorMode === "dark" ? "gray.400" : "gray.500",
            }}
            _focus={{ boxShadow: "none" }}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder={t("searchPlaceholder")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const params = { page: "1" };

                if (searchName.trim()) {
                  params.name = searchName.trim();
                }

                setSearchParams(params);
              }
            }}
          />
        </InputGroup>
      </Box>

      <Box textAlign="center" mt={6} mb={4}>
        <Heading color={colorMode === "dark" ? "white" : "gray.800"}>
          {t("articlePageTitle")}
        </Heading>
        <Text color={colorMode === "dark" ? "gray.300" : "gray.600"} mt={2}>
          {t("articlePageText")}
        </Text>
      </Box>

      {isLoading && (
        <Text textAlign="center" mt={4}>
          Завантаження...
        </Text>
      )}

      {isError && (
        <Text textAlign="center" mt={4} color="red.400">
          Помилка завантаження статей
        </Text>
      )}

      <Flex gap="10px" wrap="wrap" justify="center" align="center" mb={6}>
        {data?.results?.map((item) => (
          <ArticleCard key={item.id} data={item} showStatus={true} />
        ))}
      </Flex>

      <PaginationRoot
        count={data?.count || 0}
        pageSize={10}
        page={page}
        onPageChange={(e) => {
          const params = { page: String(e.page) };

          if (name) {
            params.name = name;
          }

          setSearchParams(params);
        }}
        size="lg"
      >
        <HStack justify="center" mt={2}>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
    </AdsLayout>
  );
}
