import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  SimpleGrid,
  Stack,
  Text,
  Center,
  Badge,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { LuSearch, LuArrowRight, LuSparkles } from "react-icons/lu";
import {
  FaHandsHelping,
  FaUserFriends,
  FaComments,
  FaRegLightbulb,
  FaShieldAlt,
  FaHeart,
  FaCheckCircle,
} from "react-icons/fa";
import { useColorMode } from "../../components/ui/color-mode";
import {
  useGetVolunteersQuery,
  useGetCategoriesQuery,
} from "../../Store/services/volunteer";
import { useGetUserQuery } from "../../Store/services/user";
import VolunteerCard from "../VolunteerPage/VolunteerCard";
import "../../colors.css";
import AdsLayout from "../../components/ads/AdsLayout";
import HowCard from "./HowCard";
import AudienceCard from "./AudienceCard";

const MotionBox = motion(Box);
const MotionStack = motion(Stack);
const MotionFlex = motion(Flex);

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const fadeUpTransition = {
  duration: 0.55,
  ease: "easeOut",
};

export default function MainPage() {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isDark = colorMode === "dark";

  const [searchName, setSearchName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const { data: userData } = useGetUserQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data } = useGetVolunteersQuery({ page: 1 });

  const volunteers = data?.results?.slice(0, 3) || [];
  const categories = categoriesData?.results || categoriesData || [];

  const cardBg = isDark
    ? "rgba(17, 24, 39, 0.88)"
    : "rgba(255, 255, 255, 0.88)";
  const cardText = isDark ? "white" : "gray.800";
  const mutedText = isDark ? "gray.300" : "gray.600";
  const borderColor = isDark ? "whiteAlpha.200" : "blackAlpha.100";
  const softShadow = "0 20px 55px rgba(0, 0, 0, 0.16)";
  const bigShadow = "0 35px 90px rgba(0, 0, 0, 0.26)";

  const goToVolunteers = (categoriesValue = selectedCategories) => {
    const params = new URLSearchParams();
    params.set("page", "1");

    if (searchName.trim()) {
      params.set("name", searchName.trim());
    }

    if (categoriesValue.length > 0) {
      params.set("category", categoriesValue.join(","));
    }

    navigate(`/volunteers?${params.toString()}`);
  };

  const audienceCards = [
    {
      icon: FaHandsHelping,
      title: t("mainAudience1Title"),
      text: t("mainAudience1Text"),
    },
    {
      icon: FaUserFriends,
      title: t("mainAudience2Title"),
      text: t("mainAudience2Text"),
    },
    {
      icon: FaComments,
      title: t("mainAudience3Title"),
      text: t("mainAudience3Text"),
    },
    {
      icon: FaRegLightbulb,
      title: t("mainAudience4Title"),
      text: t("mainAudience4Text"),
    },
  ];

  const howCards = [
    {
      number: "01",
      title: t("mainHow1Title"),
      text: t("mainHow1Text"),
    },
    {
      number: "02",
      title: t("mainHow2Title"),
      text: t("mainHow2Text"),
    },
    {
      number: "03",
      title: t("mainHow3Title"),
      text: t("mainHow3Text"),
    },
  ];

  return (
    <AdsLayout justifyContent="center">
      <Container maxW="1250px" w="100%" mx="auto" px={{ base: 4, md: 6 }}>
        {/* <Text
          color="red"
          fontSize={{ base: "22px", md: "30px" }}
          fontWeight="900"
          mt={5}
          mb={5}
          textAlign="center"
        >
          {t("thisSiteEtc")}
        </Text> */}

        <MotionBox
          position="relative"
          overflow="hidden"
          bg="var(--linear-main)"
          color="white"
          borderRadius={{ base: "32px", md: "48px" }}
          p={{ base: 7, md: 12 }}
          boxShadow={bigShadow}
          mb={12}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={fadeUpTransition}
        >
          <Box
            position="absolute"
            top="-90px"
            right="-80px"
            w="280px"
            h="280px"
            borderRadius="full"
            bg="whiteAlpha.200"
          />

          <Box
            position="absolute"
            bottom="-90px"
            left="-80px"
            w="240px"
            h="240px"
            borderRadius="70px 160px 70px 160px"
            bg="yellow.300"
            opacity="0.35"
            transform="rotate(16deg)"
          />

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} alignItems="center">
            <Stack gap={6} position="relative" zIndex={2}>
              <Badge
                w="fit-content"
                px={4}
                py={2}
                borderRadius="full"
                bg="whiteAlpha.300"
                color="white"
                fontWeight="800"
              >
                <Flex align="center" gap={2}>
                  <Icon as={LuSparkles} />
                  CareBridge
                </Flex>
              </Badge>

              <Heading
                fontSize={["2xl", "3xl", "6xl"]}
                fontWeight="950"
                lineHeight="1.04"
                maxW="680px"
              >
                {t("mainHeroTitle")}
              </Heading>

              <Text
                fontSize={{ base: "md", md: "xl" }}
                lineHeight="1.9"
                color="whiteAlpha.900"
                maxW="640px"
              >
                {t("mainHeroText")}
              </Text>

              <Flex gap={4} flexWrap="wrap">
                <Button
                  onClick={() => navigate("/volunteers")}
                  bg="white"
                  color="gray.900"
                  borderRadius="full"
                  h="54px"
                  px={8}
                  fontWeight="900"
                  _hover={{
                    bg: "gray.100",
                    transform: "translateY(-3px)",
                    boxShadow: "0 16px 30px rgba(0,0,0,0.22)",
                  }}
                  transition="0.2s"
                >
                  {t("mainHeroBtn1")}
                </Button>

                {!userData?.username && (
                  <Button
                    onClick={() => navigate("/signup")}
                    variant="outline"
                    borderColor="whiteAlpha.800"
                    color="white"
                    borderRadius="full"
                    h="54px"
                    px={8}
                    fontWeight="900"
                    _hover={{
                      bg: "whiteAlpha.200",
                    }}
                    transition="0.2s"
                  >
                    {t("mainHeroBtn2")}
                  </Button>
                )}
              </Flex>

              <Flex gap={3} flexWrap="wrap" pt={2}>
                <Badge borderRadius="full" px={4} py={2} bg="whiteAlpha.250">
                  24/7 {t("mainBadgeSupport")}
                </Badge>
                <Badge borderRadius="full" px={4} py={2} bg="whiteAlpha.250">
                  {t("mainBadgeSearch")}
                </Badge>
                <Badge borderRadius="full" px={4} py={2} bg="whiteAlpha.250">
                  {t("mainBadgeSafe")}
                </Badge>
              </Flex>
            </Stack>

            <Box
              display={{ base: "none", md: "block" }}
              position="relative"
              minH="470px"
              zIndex={2}
            >
              <Box
                position="absolute"
                top="20px"
                right="30px"
                w="330px"
                bg={isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255,255,255,0.92)"}
                color={isDark ? "white" : "gray.800"}
                border="1px solid"
                borderColor="whiteAlpha.300"
                borderRadius="34px"
                p={6}
                boxShadow="0 24px 60px rgba(0,0,0,0.24)"
                backdropFilter="blur(10px)"
              >
                <Flex
                  w="56px"
                  h="56px"
                  borderRadius="22px"
                  bg="var(--linear-main)"
                  color="white"
                  align="center"
                  justify="center"
                  mb={4}
                >
                  <Icon as={FaHeart} boxSize={6} />
                </Flex>

                <Text fontSize="sm" opacity="0.7" mb={2} fontWeight="700">
                  CareBridge
                </Text>

                <Heading fontSize="2xl" mb={3}>
                  {t("mainMiniCard1Title")}
                </Heading>

                <Text
                  fontSize="sm"
                  lineHeight="1.8"
                  color={isDark ? "gray.300" : "gray.600"}
                >
                  {t("mainMiniCard1Text")}
                </Text>
              </Box>

              <Box
                position="absolute"
                bottom="55px"
                left="15px"
                w="260px"
                bg="whiteAlpha.250"
                color="white"
                border="1px solid"
                borderColor="whiteAlpha.300"
                borderRadius="30px"
                p={5}
                boxShadow="0 18px 45px rgba(0,0,0,0.22)"
                backdropFilter="blur(8px)"
              >
                <Flex align="center" gap={3} mb={3}>
                  <Flex
                    w="45px"
                    h="45px"
                    borderRadius="full"
                    bg="whiteAlpha.300"
                    align="center"
                    justify="center"
                  >
                    <Icon as={FaShieldAlt} />
                  </Flex>

                  <Box>
                    <Text fontSize="lg" fontWeight="900">
                      {t("mainMiniCard2Title")}
                    </Text>
                    <Text fontSize="sm" color="whiteAlpha.800">
                      {t("mainMiniCard2Text")}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </SimpleGrid>
        </MotionBox>

        <MotionBox
          bg={cardBg}
          color={cardText}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="38px"
          p={{ base: 6, md: 8 }}
          boxShadow={softShadow}
          mb={14}
          position="relative"
          overflow="hidden"
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} alignItems="center">
            <Stack gap={4}>
              <Badge
                w="fit-content"
                bg={isDark ? "green.800" : "green.100"}
                color={isDark ? "green.100" : "green.700"}
                borderRadius="full"
                px={4}
                py={2}
              >
                {t("mainSearchLabel")}
              </Badge>

              <Heading fontSize={{ base: "3xl", md: "5xl" }} lineHeight="1.1">
                {t("mainSearchTitle")}
              </Heading>

              <Text
                color={mutedText}
                lineHeight="1.8"
                fontSize={{ base: "md", md: "lg" }}
              >
                {t("mainSearchText")}
              </Text>
            </Stack>

            <Box>
              <InputGroup
                mx="auto"
                h="62px"
                borderRadius="24px"
                bg={isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)"}
                border="2px solid"
                borderColor={isDark ? "whiteAlpha.300" : "var(--main-color)"}
                boxShadow="0 14px 34px rgba(72, 187, 120, 0.18)"
                backdropFilter="blur(8px)"
                transition="0.25s"
                _focusWithin={{
                  borderColor: "green.400",
                  boxShadow:
                    "0 0 0 4px rgba(72, 187, 120, 0.20), 0 16px 36px rgba(72, 187, 120, 0.24)",
                }}
                startElement={
                  <Box color="green.500" ml={3}>
                    <LuSearch size={22} />
                  </Box>
                }
                endElement={
                  <Button
                    h="46px"
                    px={6}
                    mr="8px"
                    borderRadius="18px"
                    bg="var(--main-color)"
                    color="white"
                    fontWeight="900"
                    _hover={{
                      bgGradient: "linear(to-r, green.400, green.700)",
                    }}
                    _active={{ transform: "scale(0.96)" }}
                    transition="0.2s"
                    onClick={() => goToVolunteers()}
                  >
                    {t("search")}
                  </Button>
                }
              >
                <Input
                  h="100%"
                  pl={4}
                  pr="130px"
                  border="none"
                  outline="none"
                  fontSize="15px"
                  fontWeight="700"
                  color={isDark ? "white" : "gray.700"}
                  _placeholder={{
                    color: isDark ? "gray.400" : "gray.500",
                  }}
                  _focus={{ boxShadow: "none" }}
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      goToVolunteers();
                    }
                  }}
                />
              </InputGroup>

              {categories.length > 0 && (
                <Flex
                  mt={5}
                  gap={3}
                  justify="center"
                  align="center"
                  wrap="wrap"
                >
                  <Button
                    size="sm"
                    px={5}
                    borderRadius="full"
                    bg={
                      selectedCategories.length === 0
                        ? "var(--main-color)"
                        : isDark
                          ? "gray.900"
                          : "white"
                    }
                    color={
                      selectedCategories.length === 0
                        ? "white"
                        : "var(--main-color)"
                    }
                    border="2px solid"
                    borderColor="var(--main-color)"
                    boxShadow="0 8px 20px rgba(0,0,0,0.10)"
                    fontWeight="900"
                    onClick={() => {
                      setSelectedCategories([]);
                      goToVolunteers([]);
                    }}
                  >
                    {t("all")}
                  </Button>

                  {categories.map((cat) => {
                    const isSelected = selectedCategories.includes(
                      String(cat.id),
                    );

                    return (
                      <Button
                        key={cat.id}
                        size="sm"
                        px={5}
                        borderRadius="full"
                        bg={
                          isSelected
                            ? "var(--main-color)"
                            : isDark
                              ? "gray.900"
                              : "white"
                        }
                        color={isSelected ? "white" : "var(--main-color)"}
                        border="2px solid"
                        borderColor="var(--main-color)"
                        boxShadow="0 8px 20px rgba(0,0,0,0.10)"
                        fontWeight="800"
                        _hover={{
                          bg: isSelected
                            ? "green.600"
                            : isDark
                              ? "gray.700"
                              : "green.50",
                          transform: "translateY(-2px)",
                        }}
                        transition="0.2s"
                        onClick={() => {
                          let newCategories;

                          if (isSelected) {
                            newCategories = selectedCategories.filter(
                              (id) => id !== String(cat.id),
                            );
                          } else {
                            newCategories = [
                              ...selectedCategories,
                              String(cat.id),
                            ];
                          }

                          setSelectedCategories(newCategories);
                          goToVolunteers(newCategories);
                        }}
                      >
                        {cat.name}
                      </Button>
                    );
                  })}
                </Flex>
              )}
            </Box>
          </SimpleGrid>
        </MotionBox>

        <MotionStack
          gap={3}
          mb={10}
          textAlign="center"
          align="center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={fadeUpTransition}
        >
          <Badge
            bg={isDark ? "green.800" : "green.100"}
            color={isDark ? "green.100" : "green.700"}
            borderRadius="full"
            px={4}
            py={2}
          >
            CareBridge
          </Badge>

          <Heading color={cardText} fontSize={{ base: "3xl", md: "5xl" }}>
            {t("mainAudienceTitle")}
          </Heading>

          <Text
            color={mutedText}
            maxW="760px"
            mx="auto"
            lineHeight="1.8"
            fontSize="lg"
          >
            {t("mainAudienceText")}
          </Text>
        </MotionStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={16}>
          {audienceCards.map((item, index) => (
            <AudienceCard
              key={index}
              index={index}
              title={item.title}
              text={item.text}
              icon={item.icon}
              cardBg={cardBg}
              cardText={cardText}
              mutedText={mutedText}
              borderColor={borderColor}
              softShadow={softShadow}
            />
          ))}
        </SimpleGrid>

        <MotionBox
          bg="var(--linear-main)"
          color="white"
          borderRadius="42px"
          p={{ base: 7, md: 10 }}
          boxShadow={bigShadow}
          mb={16}
          position="relative"
          overflow="hidden"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={fadeUpTransition}
        >
          <Stack
            gap={3}
            mb={9}
            textAlign="center"
            position="relative"
            zIndex={2}
          >
            <Badge
              w="fit-content"
              mx="auto"
              bg="whiteAlpha.300"
              color="white"
              borderRadius="full"
              px={4}
              py={2}
            >
              <Icon as={FaCheckCircle} mr={2} />
              CareBridge
            </Badge>

            <Heading fontSize={{ base: "3xl", md: "5xl" }}>
              {t("mainHowTitle")}
            </Heading>
          </Stack>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            gap={6}
            position="relative"
            zIndex={2}
          >
            {howCards.map((item) => (
              <HowCard
                key={item.number}
                number={item.number}
                title={item.title}
                text={item.text}
              />
            ))}
          </SimpleGrid>
        </MotionBox>

        <MotionStack
          gap={3}
          mb={10}
          textAlign="center"
          align="center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={fadeUpTransition}
        >
          <Badge
            bg={isDark ? "green.800" : "green.100"}
            color={isDark ? "green.100" : "green.700"}
            borderRadius="full"
            px={4}
            py={2}
          >
            {t("mainVolunteersTitle")}
          </Badge>

          <Heading color={cardText} fontSize={{ base: "3xl", md: "5xl" }}>
            {t("mainVolunteersTitle")}
          </Heading>

          <Text
            color={mutedText}
            maxW="760px"
            mx="auto"
            lineHeight="1.8"
            fontSize="lg"
          >
            {t("mainVolunteersText")}
          </Text>
        </MotionStack>

        <Flex gap="24px" wrap="wrap" justify="center" align="stretch" mb={8}>
          {volunteers.map((volunteer) => (
            <VolunteerCard data={volunteer} key={volunteer.id} />
          ))}
        </Flex>

        <Center mb={16}>
          <Button
            onClick={() => navigate("/volunteers")}
            bg="var(--main-color)"
            color="white"
            borderRadius="full"
            h="54px"
            px={9}
            fontWeight="900"
            boxShadow="0 14px 30px rgba(72, 187, 120, 0.28)"
            _hover={{
              bg: "green.600",
              transform: "translateY(-2px)",
            }}
            transition="0.2s"
          >
            {t("mainViewAll")}
          </Button>
        </Center>

        <MotionBox
          bg="var(--linear-main)"
          color="white"
          borderRadius="45px"
          mb={10}
          p={{ base: 8, md: 12 }}
          textAlign="center"
          position="relative"
          overflow="hidden"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={fadeUpTransition}
        >
          <Box
            position="absolute"
            right="-60px"
            top="-70px"
            w="230px"
            h="230px"
            borderRadius="45px 150px 45px 150px"
            bg="yellow.300"
            opacity="0.38"
            transform="rotate(14deg)"
          />

          <Stack gap={5} alignItems="center" position="relative" zIndex={2}>
            <Badge
              bg="whiteAlpha.300"
              color="white"
              borderRadius="full"
              px={4}
              py={2}
            >
              CareBridge
            </Badge>

            <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight="950">
              {t("mainCtaTitle")}
            </Heading>

            <Text
              maxW="720px"
              lineHeight="1.8"
              fontSize="lg"
              color="whiteAlpha.900"
            >
              {t("mainCtaText")}
            </Text>

            {!userData?.username && (
              <Button
                onClick={() => navigate("/signup")}
                bg="white"
                color="gray.900"
                borderRadius="full"
                h="56px"
                px={9}
                fontWeight="900"
                boxShadow="0 16px 35px rgba(0,0,0,0.22)"
                _hover={{
                  bg: "gray.100",
                  transform: "translateY(-3px)",
                }}
                transition="0.2s"
              >
                {t("mainCtaButton")}
              </Button>
            )}
          </Stack>
        </MotionBox>
      </Container>
    </AdsLayout>
  );
}
