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
import { useUpdateVolunteerMutation } from "../../Store/services/profile";
import {
  useGetCategoriesQuery,
  useGetOneVolunteerQuery,
} from "../../Store/services/volunteer";
import JoditEditor from "jodit-react";
import AdsLayout from "../../components/ads/AdsLayout";

export default function EditVolunteerPage() {
  const { id } = useParams();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const navigate = useNavigate();
  const editor = useRef(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [mainDescription, setMainDescription] = useState("");
  const [image, setImage] = useState(null);

  const { data, isLoading: volunteerLoading } = useGetOneVolunteerQuery(id);
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const [updateVolunteer, { isLoading }] = useUpdateVolunteerMutation();

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setCategory(data.category?.id || "");
      setDescription(data.description || "");
      setMainDescription(data.main_description || "");
    }
  }, [data]);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 300,
      placeholder: "Введіть опис волонтерства...",
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
      alert("Вкажіть назву волонтерства");
      return;
    }

    if (!description.trim()) {
      alert("Вкажіть опис волонтерства");
      return;
    }

    if (!mainDescription.trim()) {
      alert("Вкажіть короткий опис волонтерства");
      return;
    }

    if (!category) {
      alert("Оберіть категорію");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("main_description", mainDescription);
      formData.append("category_id", category);

      if (image) {
        formData.append("image", image);
      }

      await updateVolunteer({ id, body: formData }).unwrap();
      navigate(`/volunteers/${id}`);
    } catch (error) {
      console.error("Update volunteer error:", error);
      alert("Не вдалося оновити волонтерство");
    }
  }

  if (volunteerLoading) {
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
            Редагувати волонтерство
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
                Категорія
              </Text>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  background: isDark ? "#171923" : "white",
                  color: isDark ? "white" : "#1A202C",
                  border: isDark ? "1px solid #4A5568" : "1px solid #CBD5E0",
                }}
              >
                <option value="">
                  {categoriesLoading ? "Завантаження..." : "Оберіть категорію"}
                </option>

                {(categoriesData?.results || categoriesData || []).map(
                  (item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ),
                )}
              </select>
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
