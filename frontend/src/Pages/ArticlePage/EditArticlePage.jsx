import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { useColorMode } from "../../components/ui/color-mode";
import { useNavigate, useParams } from "react-router";
import { useUpdateArticleMutation } from "../../Store/services/profile";
import JoditEditor from "jodit-react";
import AdsLayout from "../../components/ads/AdsLayout";

export default function EditArticlePage() {
  const { id } = useParams();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const navigate = useNavigate();
  const editor = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainDescription, setMainDescription] = useState("");
  const [image, setImage] = useState(null);

  const { data, isLoading: articleLoading } = useGetOneArticleQuery(id);
  const [updateArticle, { isLoading }] = useUpdateArticleMutation();

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setDescription(data.description || "");
      setMainDescription(data.main_description || "");
    }
  }, [data]);

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

    if (!mainDescription.trim()) {
      alert("Вкажіть короткий опис статті");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("main_description", mainDescription);

      if (image) {
        formData.append("image", image);
      }

      await updateArticle({ id, body: formData }).unwrap();
      navigate(`/articles/${id}`);
    } catch (error) {
      console.error("Update article error:", error);
      alert("Не вдалося оновити статтю");
    }
  }

  if (articleLoading) {
    return (
      <Container maxW="900px" py={10}>
        <Spinner size="xl" />
      </Container>
    );
  }

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
            Редагувати статтю
          </Heading>

          <VStack align="stretch" gap={5}>
            <Box>
              <Text mb={2} color={isDark ? "gray.300" : "gray.700"}>
                Назва
              </Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введіть назву"
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
                  onBlur={(newContent) => setDescription(newContent)}
                />
              </Box>
            </Box>

            <Box>
              <Text mb={2} color={isDark ? "gray.300" : "gray.700"}>
                Короткий опис - пишеться на картці
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
                  value={mainDescription}
                  config={config}
                  onBlur={(newContent) => setMainDescription(newContent)}
                />
              </Box>
            </Box>

            <Box>
              <Text mb={2} color={isDark ? "gray.300" : "gray.700"}>
                Нове зображення
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
              {isLoading ? <Spinner size="sm" /> : "Зберегти зміни"}
            </Button>
          </VStack>
        </Box>
      </Container>
    </AdsLayout>
  );
}
