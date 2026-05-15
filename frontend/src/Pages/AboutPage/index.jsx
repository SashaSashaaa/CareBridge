import React, { useMemo } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useColorMode } from "../../components/ui/color-mode";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useGetUserQuery } from "../../Store/services/user";
import "../../colors.css";
import AdsLayout from "../../components/ads/AdsLayout";

import {
  FaHandsHelping,
  FaUserFriends,
  FaComments,
  FaShieldAlt,
  FaHeart,
  FaGlobeEurope,
  FaArrowRight,
  FaSearchLocation,
  FaCheckCircle,
  FaLightbulb,
} from "react-icons/fa";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionStack = motion(Stack);

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

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -35,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 35,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const animTransition = {
  duration: 0.55,
  ease: "easeOut",
};

export default function AboutPage() {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: userData } = useGetUserQuery();

  const isDark = colorMode === "dark";

  const cardBg = isDark ? "rgba(18, 24, 35, 0.96)" : "rgba(255,255,255,0.96)";
  const titleColor = isDark ? "white" : "gray.900";
  const textColor = isDark ? "gray.300" : "gray.700";
  const borderColor = isDark ? "whiteAlpha.200" : "blackAlpha.100";

  const directions = useMemo(
    () => [
      {
        icon: FaHandsHelping,
        title: t("aboutDirection1Title"),
        text: t("aboutDirection1Text"),
      },
      {
        icon: FaComments,
        title: t("aboutDirection2Title"),
        text: t("aboutDirection2Text"),
      },
      {
        icon: FaUserFriends,
        title: t("aboutDirection3Title"),
        text: t("aboutDirection3Text"),
      },
    ],
    [t],
  );

  const values = useMemo(
    () => [
      {
        icon: FaHeart,
        title: t("aboutValue1Title"),
        text: t("aboutValue1Text"),
      },
      {
        icon: FaGlobeEurope,
        title: t("aboutValue2Title"),
        text: t("aboutValue2Text"),
      },
      {
        icon: FaShieldAlt,
        title: t("aboutValue3Title"),
        text: t("aboutValue3Text"),
      },
      {
        icon: FaLightbulb,
        title: t("aboutValue4Title"),
        text: t("aboutValue4Text"),
      },
    ],
    [t],
  );

  const steps = useMemo(
    () => [
      {
        icon: FaSearchLocation,
        number: "01",
        title: t("aboutStep1Title"),
        text: t("aboutStep1Text"),
      },
      {
        icon: FaCheckCircle,
        number: "02",
        title: t("aboutStep2Title"),
        text: t("aboutStep2Text"),
      },
      {
        icon: FaHandsHelping,
        number: "03",
        title: t("aboutStep3Title"),
        text: t("aboutStep3Text"),
      },
    ],
    [t],
  );

  const mainShadow = "0 18px 45px rgba(0,0,0,0.16)";
  const lightShadow = "0 12px 28px rgba(0,0,0,0.12)";

  return (
    <AdsLayout>
      <Box py={{ base: 8, md: 12 }}>
        <Container maxW="1180px" mx="auto" px={{ base: 4, md: 8 }}>
          <MotionBox
            maxW="1000px"
            mx="auto"
            bg="var(--linear-main)"
            color="white"
            borderRadius="44px"
            p={{ base: 8, md: 12 }}
            mb={8}
            boxShadow={mainShadow}
            position="relative"
            overflow="hidden"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={animTransition}
          >
            <Box
              position="absolute"
              top="-80px"
              right="-70px"
              w="260px"
              h="260px"
              borderRadius="full"
              bg="whiteAlpha.200"
            />

            <Box
              position="absolute"
              bottom="-80px"
              left="-40px"
              w="210px"
              h="210px"
              borderRadius="40px 140px 40px 140px"
              bg="yellow.300"
              opacity="0.3"
              transform="rotate(14deg)"
            />

            <Stack
              gap={6}
              maxW="780px"
              mx="auto"
              textAlign="center"
              alignItems="center"
              position="relative"
              zIndex={2}
            >
              <Badge
                w="fit-content"
                px={4}
                py={2}
                borderRadius="full"
                bg="whiteAlpha.300"
                color="white"
              >
                CareBridge
              </Badge>

              <Heading
                fontSize={{ base: "4xl", md: "6xl" }}
                lineHeight="1.05"
                fontWeight="900"
              >
                {t("aboutHeroTitle")}
              </Heading>

              <Text fontSize={{ base: "md", md: "xl" }} lineHeight="1.9">
                {t("aboutHeroText")}
              </Text>

              <Flex gap={4} flexWrap="wrap" justify="center">
                <Button
                  onClick={() => navigate("/volunteers")}
                  bg="white"
                  color="gray.900"
                  borderRadius="full"
                  px={8}
                  h="52px"
                  transition="0.2s"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: lightShadow,
                  }}
                >
                  {t("aboutHeroBtnVolunteer")}
                </Button>

                <Button
                  onClick={() => navigate("/aisupport")}
                  variant="outline"
                  color="white"
                  borderColor="whiteAlpha.700"
                  borderRadius="full"
                  px={8}
                  h="52px"
                  transition="0.2s"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  {t("aiSupport")}
                </Button>
              </Flex>
            </Stack>
          </MotionBox>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            gap={6}
            maxW="1000px"
            mx="auto"
            mb={14}
          >
            {[
              ["24/7", t("aboutStat1Title"), t("aboutStat1Text")],
              ["100+", t("aboutStat2Title"), t("aboutStat2Text")],
              ["1", t("aboutStat3Title"), t("aboutStat3Text")],
            ].map((item, index) => (
              <MotionBox
                key={index}
                bg="var(--linear-main)"
                color="white"
                borderRadius="30px"
                p={6}
                minH="155px"
                boxShadow={lightShadow}
                position="relative"
                overflow="hidden"
                _hover={{ transform: "translateY(-3px)" }}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: index * 0.12,
                }}
              >
                <Text
                  position="absolute"
                  right="18px"
                  top="4px"
                  fontSize="6xl"
                  fontWeight="900"
                  color="whiteAlpha.300"
                >
                  {item[0]}
                </Text>

                <Heading fontSize="2xl" mb={3} position="relative">
                  {item[1]}
                </Heading>

                <Text color="whiteAlpha.900" position="relative">
                  {item[2]}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>

          <MotionStack
            textAlign="center"
            alignItems="center"
            gap={3}
            mb={9}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={animTransition}
          >
            <Heading color={titleColor} fontSize={{ base: "3xl", md: "5xl" }}>
              {t("aboutWhatWeDo")}
            </Heading>

            <Text color={textColor} maxW="780px" lineHeight="1.8" fontSize="lg">
              {t("aboutWhatWeDoText")}
            </Text>
          </MotionStack>

          <Stack maxW="1000px" mx="auto" gap={7} mb={16}>
            {directions.map((item, index) => {
              const isReverse = index % 2 !== 0;

              return (
                <MotionFlex
                  key={index}
                  direction={{
                    base: "column",
                    md: isReverse ? "row-reverse" : "row",
                  }}
                  bg={cardBg}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="38px"
                  overflow="hidden"
                  boxShadow={lightShadow}
                  variants={isReverse ? fadeRight : fadeLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  transition={animTransition}
                >
                  <Flex
                    flex="0.8"
                    minH="240px"
                    bg="var(--linear-main)"
                    color="white"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      w="170px"
                      h="170px"
                      borderRadius="full"
                      bg="whiteAlpha.200"
                      top="-40px"
                      right="-30px"
                    />

                    <Box
                      position="absolute"
                      w="120px"
                      h="120px"
                      borderRadius="35px 90px 35px 90px"
                      bg="yellow.300"
                      opacity="0.5"
                      bottom="-25px"
                      left="35px"
                      transform="rotate(15deg)"
                    />

                    <Icon
                      as={item.icon}
                      boxSize={20}
                      position="relative"
                      zIndex={2}
                    />
                  </Flex>

                  <Stack flex="1.2" p={{ base: 7, md: 9 }} justify="center">
                    <Badge
                      w="fit-content"
                      bg="green.100"
                      color="green.700"
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      0{index + 1}
                    </Badge>

                    <Heading
                      color={titleColor}
                      fontSize={{ base: "2xl", md: "4xl" }}
                    >
                      {item.title}
                    </Heading>

                    <Text
                      color={textColor}
                      fontSize={{ base: "md", md: "lg" }}
                      lineHeight="1.9"
                    >
                      {item.text}
                    </Text>
                  </Stack>
                </MotionFlex>
              );
            })}
          </Stack>

          <MotionBox
            maxW="1000px"
            mx="auto"
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="42px"
            p={{ base: 7, md: 10 }}
            boxShadow={lightShadow}
            mb={16}
            position="relative"
            overflow="hidden"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={animTransition}
          >
            <Box
              position="absolute"
              top="-80px"
              right="-70px"
              w="240px"
              h="240px"
              borderRadius="full"
              bg="green.300"
              opacity="0.18"
            />

            <Stack
              textAlign="center"
              alignItems="center"
              mb={8}
              position="relative"
              zIndex={2}
            >
              <Badge
                bg="green.100"
                color="green.700"
                borderRadius="full"
                px={4}
                py={2}
              >
                {t("aboutValuesBadge")}
              </Badge>

              <Heading color={titleColor} fontSize={{ base: "3xl", md: "5xl" }}>
                {t("aboutValues")}
              </Heading>
            </Stack>

            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              gap={5}
              position="relative"
              zIndex={2}
            >
              {values.map((item, index) => (
                <MotionFlex
                  key={index}
                  bg="var(--linear-main)"
                  color="white"
                  borderRadius="28px"
                  p={5}
                  gap={4}
                  alignItems="flex-start"
                  boxShadow="0 10px 24px rgba(0,0,0,0.14)"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.45,
                    ease: "easeOut",
                    delay: index * 0.1,
                  }}
                >
                  <Flex
                    minW="52px"
                    h="52px"
                    borderRadius="18px"
                    bg="whiteAlpha.300"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={item.icon} boxSize={5} />
                  </Flex>

                  <Box>
                    <Heading fontSize="lg" mb={2}>
                      {item.title}
                    </Heading>

                    <Text color="whiteAlpha.900" fontSize="sm" lineHeight="1.7">
                      {item.text}
                    </Text>
                  </Box>
                </MotionFlex>
              ))}
            </SimpleGrid>
          </MotionBox>

          <MotionStack
            textAlign="center"
            alignItems="center"
            gap={3}
            mb={9}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={animTransition}
          >
            <Heading color={titleColor} fontSize={{ base: "3xl", md: "5xl" }}>
              {t("aboutHowItWorks")}
            </Heading>

            <Text color={textColor} maxW="780px" lineHeight="1.8" fontSize="lg">
              {t("aboutHowItWorksText")}
            </Text>
          </MotionStack>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            gap={7}
            maxW="1000px"
            mx="auto"
            mb={16}
          >
            {steps.map((item, index) => (
              <MotionBox
                key={index}
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="35px"
                p={7}
                minH="285px"
                boxShadow={lightShadow}
                position="relative"
                overflow="hidden"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: index * 0.12,
                }}
              >
                <Text
                  position="absolute"
                  right="18px"
                  top="-12px"
                  fontSize="8xl"
                  fontWeight="900"
                  color="green.300"
                  opacity="0.2"
                >
                  {item.number}
                </Text>

                <Flex
                  w="62px"
                  h="62px"
                  borderRadius="full"
                  bg="var(--linear-main)"
                  color="white"
                  alignItems="center"
                  justifyContent="center"
                  mb={5}
                  position="relative"
                  zIndex={2}
                >
                  <Icon as={item.icon} boxSize={6} />
                </Flex>

                <Heading
                  color={titleColor}
                  fontSize="2xl"
                  mb={3}
                  position="relative"
                  zIndex={2}
                >
                  {item.title}
                </Heading>

                <Text color={textColor} lineHeight="1.8" position="relative" zIndex={2}>
                  {item.text}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>

          <MotionBox
            maxW="1000px"
            mx="auto"
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="36px"
            p={{ base: 7, md: 9 }}
            mb={12}
            boxShadow={lightShadow}
            position="relative"
            overflow="hidden"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={animTransition}
          >
            <Box
              position="absolute"
              left="0"
              top="0"
              h="100%"
              w="9px"
              bg="var(--linear-main)"
            />

            <Heading
              color={titleColor}
              mb={4}
              fontSize={{ base: "2xl", md: "4xl" }}
            >
              {t("aboutWhyImportant")}
            </Heading>

            <Text
              color={textColor}
              lineHeight="1.9"
              fontSize={{ base: "md", md: "lg" }}
            >
              {t("aboutWhyImportantText")}
            </Text>
          </MotionBox>

          <MotionBox
            maxW="1000px"
            mx="auto"
            bg="var(--linear-main)"
            color="white"
            borderRadius="45px"
            p={{ base: 8, md: 12 }}
            mb={10}
            boxShadow={mainShadow}
            position="relative"
            overflow="hidden"
            textAlign="center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={animTransition}
          >
            <Box
              position="absolute"
              right="-40px"
              top="-70px"
              w="220px"
              h="220px"
              borderRadius="40px 140px 40px 140px"
              bg="yellow.300"
              opacity="0.4"
              transform="rotate(12deg)"
            />

            <Stack gap={5} alignItems="center" position="relative" zIndex={2}>
              <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight="900">
                {t("aboutCtaTitle")}
              </Heading>

              <Text
                maxW="760px"
                fontSize="lg"
                lineHeight="1.8"
                color="whiteAlpha.900"
              >
                {t("aboutCtaText")}
              </Text>

              {!userData?.username && (
                <Button
                  onClick={() => navigate("/signup")}
                  bg="white"
                  color="gray.900"
                  borderRadius="full"
                  h="56px"
                  px={9}
                  fontSize="md"
                  transition="0.2s"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: lightShadow,
                  }}
                >
                  {t("aboutCtaButton")}
                  <Icon as={FaArrowRight} ml={3} />
                </Button>
              )}
            </Stack>
          </MotionBox>
        </Container>
      </Box>
    </AdsLayout>
  );
}