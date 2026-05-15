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
import { useUpdateStoryMutation } from "../../Store/services/profile";
import { useGetOneStoryQuery } from "../../Store/services/story";
import JoditEditor from "jodit-react";
import AdsLayout from "../../components/ads/AdsLayout";

export default function EditStoryPage() {
  const { id } = useParams();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const navigate = useNavigate();
  const editor = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const { data, isLoading: storyLoading } = useGetOneStoryQuery(id);
  const [updateStory, { isLoading }] = useUpdateStoryMutation();

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setDescription(data.description || "");
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

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      await updateStory({ id, body: formData }).unwrap();
      navigate(`/stories`);
    } catch (error) {
      console.error("Update story error:", error);
      alert("Не вдалося оновити статтю");
    }
  }

  if (storyLoading) {
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
            Редагувати історію
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

              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введіть опис"
                bg={isDark ? "gray.900" : "white"}
                borderColor={isDark ? "gray.600" : "gray.300"}
              />
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
