import { Box, Image, Text, VStack, Link } from "@chakra-ui/react";
import { useGetAdvertisementsQuery } from "../../Store/services/advertisement";
import { useColorMode } from "../ui/color-mode";
import { useTranslation } from "react-i18next";

export default function SideAds({ position }) {
  const { data, isLoading } = useGetAdvertisementsQuery();
  const { colorMode } = useColorMode();
  const { t, i18n } = useTranslation();

  if (isLoading) return null;

  const ads = data?.filter((ad) => ad.position === position);

  if (!ads || ads.length === 0) return null;

  const toggleLanguage = () => {
    const newLang = i18n.language === "uk" ? "en" : "uk";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <VStack
      w="180px"
      gap={4}
      display={{ base: "none", xl: "flex" }}
      position="sticky"
      top="200px"
      align="stretch"
    >
      {ads.map((ad) => (
        <Link
          key={ad.id}
          href={ad.link || "#"}
          target="_blank"
          textDecoration="none"
        >
          <Box
            bg={colorMode === "dark" ? "gray.800" : "white"}
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="lg"
            border="1px solid"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
            transition="0.3s"
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: "xl",
            }}
          >
            <Text fontSize="xs" textAlign="center" color="gray.500" py={1}>
              {t("ad")}
            </Text>

            <Image
              src={ad.image}
              alt={ad.title}
              w="100%"
              h="400px"
              objectFit="cover"
            />

            <Text
              p={3}
              fontWeight="bold"
              fontSize="sm"
              textAlign="center"
              color={colorMode === "dark" ? "white" : "gray.800"}
            >
              {ad.title}
            </Text>
          </Box>
        </Link>
      ))}
    </VStack>
  );
}
