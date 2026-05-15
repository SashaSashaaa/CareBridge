import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Spinner,
  Select,
} from "@chakra-ui/react";
import { useColorMode } from "../../components/ui/color-mode";
import { useNavigate } from "react-router";
import { useCreateArticleMutation } from "../../Store/services/article";
import JoditEditor from "jodit-react";
import { useTranslation } from "react-i18next";
import AdsLayout from "../../components/ads/AdsLayout";

export default function CreateArticlePage() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const navigate = useNavigate();
  const editor = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [main_description, setMainDescription] = useState("");
  const [image, setImage] = useState(null);

  const [createArticle, { isLoading }] = useCreateArticleMutation();
  const { t, i18n } = useTranslation();

  const config = useMemo(
    () => ({
      readonly: false,
      height: 300,
      placeholder: "Введіть опис статті...",
      theme: isDark ? "dark" : "default",
      uploader: {
        insertImageAsBase64URI: true,
      },
    }),
    [isDark],
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Вкажіть назву статті");
      return;
    }

    if (!description.trim()) {
      alert("Вкажіть опис статті");
      return;
    }

    if (!main_description.trim()) {
      alert("Вкажіть короткий опис статті");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("main_description", main_description);

      if (image) {
        formData.append("image", image);
      }

      await createArticle(formData).unwrap();
      navigate("/articles");
    } catch (error) {
      console.error("Article error:", error);
      alert("Не вдалося створити статтю");
    }
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === "uk" ? "en" : "uk";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <AdsLayout>
      <Container maxW="900px" py={10}>
        <Box
          as="form"
          onSubmit={handleSubmit}
          bg={isDark ? "gray.800" : "white"}
          border="1px solid"
          borderColor={isDark ? "gray.700" : "gray.200"}
          borderRadius="2xl"
          boxShadow="lg"
          p={8}
        >
          <Heading mb={6} color={isDark ? "white" : "gray.800"}>
            {t("createVolunteering")}
          </Heading>

          <VStack align="stretch" gap={5}>
            <Box>
              <Text mb={2} color={isDark ? "gray.300" : "gray.700"}>
                {t("titleCard")}
              </Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("titleCardPlaceholder")}
                bg={isDark ? "gray.900" : "white"}
                borderColor={isDark ? "gray.600" : "gray.300"}
              />
            </Box>

            <Box>
              <Text mb={2} color={isDark ? "gray.300" : "gray.700"}>
                Опис
              </Text>

              <Box
                bg={isDark ? "gray.900" : "white"}
                border="1px solid"
                borderColor={isDark ? "gray.600" : "gray.300"}
                borderRadius="xl"
                overflow="hidden"
              >
                <JoditEditor
                  ref={editor}
                  value={description}
                  config={config}
                  placeholder={t("descriptionPlaceholderCreate")}
                  onBlur={(newContent) => setDescription(newContent)}
                />
              </Box>
            </Box>

            <Box>
              <Text mb={2} color={isDark ? "gray.300" : "gray.700"}>
                {t("shortDescriptionETC")}
              </Text>

              <Box
                bg={isDark ? "gray.900" : "white"}
                border="1px solid"
                borderColor={isDark ? "gray.600" : "gray.300"}
                borderRadius="xl"
                overflow="hidden"
              >
                <JoditEditor
                  ref={editor}
                  value={main_description}
                  config={config}
                  placeholder={t("descriptionPlaceholderCreate")}
                  onBlur={(newContent) => setMainDescription(newContent)}
                />
              </Box>
            </Box>

            <Box>
              <Text mb={2} color={isDark ? "gray.300" : "gray.700"}>
                {t("image")}
              </Text>
              <Input
                type="file"
                accept="image/*"
                p={1}
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </Box>

            <Button
              type="submit"
              bg="var(--main-color)"
              p={2}
              colorScheme="green"
              borderRadius="xl"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : <>{t("createArticle")}</>}
            </Button>
          </VStack>
        </Box>
      </Container>
    </AdsLayout>
  );
}
