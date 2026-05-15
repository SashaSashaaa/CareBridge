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
import { useCreateVolunteerMutation } from "../../Store/services/profile";
import { useGetCategoriesQuery } from "../../Store/services/volunteer";
import JoditEditor from "jodit-react";
import { useTranslation } from "react-i18next";
import AdsLayout from "../../components/ads/AdsLayout";

export default function CreateVolunteerPage() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const navigate = useNavigate();
  const editor = useRef(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [maindescription, setMainDescription] = useState("");
  const [image, setImage] = useState(null);

  const [createVolunteer, { isLoading }] = useCreateVolunteerMutation();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const { t, i18n } = useTranslation();

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

    if (!maindescription.trim()) {
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
      formData.append("maindescription", maindescription);
      formData.append("category_id", category);

      if (image) {
        formData.append("image", image);
      }

      await createVolunteer(formData).unwrap();
      navigate("/volunteers");
    } catch (error) {
      console.error("Volunteer error:", error);
      alert("Не вдалося створити волонтерство");
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
            Створити волонтерство
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
                bg={isDark ? "gray.900" : "white"}
                bordercolor={isDark ? "gray.600" : "gray.300"}
                color={isDark ? "white" : "gray.800"}
              >
                <option value="">
                  {categoriesLoading ? "Завантаження..." : "Оберіть категорію"}
                </option>

                {categoriesData?.results?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                )) ||
                  categoriesData?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
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
                  placeholder="Введіть опис"
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
                  value={maindescription}
                  config={config}
                  placeholder="Введіть короткий опис"
                  onBlur={(newContent) => setMainDescription(newContent)}
                />
              </Box>
            </Box>

            <Box>
              <Text mb={2} color={isDark ? "gray.300" : "gray.700"}>
                Зображення
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
              {isLoading ? <Spinner size="sm" /> : "Створити волонтерство"}
            </Button>
          </VStack>
        </Box>
      </Container>
    </AdsLayout>
  );
}
