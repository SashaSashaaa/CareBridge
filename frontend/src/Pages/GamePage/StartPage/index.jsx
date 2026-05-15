import { Box, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import CardMain from "../../../components/CardMain";

import ImgBeach from "./beach.png";
import ImgCoding from "./coding.png";
import ImgPlanting from "./planting.png";
import ImgBG from "./earth.jpg";

import Navbar from "../../../components/Navbar";

import { useTranslation } from "react-i18next";
import { useColorMode } from "../../../components/ui/color-mode";

const cardColors = [
  {
    color1: "#4facfe",
    color2: "#00f2fe",
  },
  {
    color1: "#43e97b",
    color2: "#38f9d7",
  },
  {
    color1: "#fa709a",
    color2: "#fee140",
  },
];

export default function StartPage({ setTopic }) {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const isDark = colorMode === "dark";

  const cards = [
    {
      img: ImgCoding,
      id: "programming",
      name: t("programming"),
      topics: [
        t("programmingTopicAlgorithms"),
        t("programmingTopicPython"),
        t("programmingTopicComputerStructure"),
        t("programmingTopicOperatingSystems"),
        t("programmingTopicInternetBrowsers"),
        t("programmingTopicSecurity"),
        t("programmingTopicHistoryIT"),
        t("programmingTopicLanguages"),
        t("programmingTopicFilesData"),
        t("programmingTopicAI"),
      ],
    },
    {
      img: ImgBeach,
      id: "tourism",
      name: t("tourism"),
      topics: [
        t("tourismTopicTypes"),
        t("tourismTopicCountriesCapitals"),
        t("tourismTopicClimateWeather"),
        t("tourismTopicOrientation"),
        t("tourismTopicBehaviorRules"),
        t("tourismTopicUkraineTravel"),
        t("tourismTopicTransport"),
        t("tourismTopicCultures"),
        t("tourismTopicSafety"),
        t("tourismTopicLandmarks"),
      ],
    },
    {
      img: ImgPlanting,
      id: "planting",
      name: t("planting"),
      topics: [
        t("plantingTopicPlantsStructure"),
        t("plantingTopicGrowthConditions"),
        t("plantingTopicVegetablesFruits"),
        t("plantingTopicPlantCare"),
        t("plantingTopicPests"),
        t("plantingTopicSeasonalWorks"),
        t("plantingTopicGreenhouses"),
        t("plantingTopicFertilizersSoils"),
        t("plantingTopicOrganicFarming"),
        t("plantingTopicGrowingTrees"),
      ],
    },
  ];

  return (
    <Box
      minH="100vh"
      backgroundImage={`linear-gradient(${
        isDark
          ? "rgba(0,0,0,0.58), rgba(0,0,0,0.72)"
          : "rgba(0,0,0,0.3), rgba(0,0,0,0.45)"
      }), url(${ImgBG})`}
      backgroundPosition="center"
      backgroundSize="cover"
      backgroundAttachment={{ base: "scroll", md: "fixed" }}
      color="white"
    >
      <Navbar />

      <Flex
        minH="100vh"
        direction="column"
        align="center"
        justify="center"
        px={{ base: 3, sm: 4, md: 8 }}
        pt={{ base: "95px", md: "120px" }}
        pb={{ base: 8, md: 12 }}
        gap={{ base: 5, md: 8 }}
      >
        <Box textAlign="center" maxW="900px">
          <Heading
            as="h1"
            fontSize={{ base: "20px", sm: "28px", md: "32px" }}
            lineHeight="1.1"
            color={isDark ? "blue.200" : "blue.300"}
            textShadow="0 3px 12px rgba(0,0,0,0.65)"
            mb={{ base: 3, md: 4 }}
          >
            {t("gameStartMainTitle")}
          </Heading>

          <Heading
            as="h2"
            fontSize={{ base: "16px", sm: "18px", md: "24px" }}
            lineHeight="1.15"
            color="white"
            textShadow="0 3px 12px rgba(0,0,0,0.7)"
          >
            {t("chooseGameDirection")}
          </Heading>
        </Box>

        <Flex
          w="100%"
          maxW="1050px"
          mx="auto"
          justify="center"
          align="center"
          wrap="wrap"
          gap={{ base: 4, sm: 6, md: 8 }}
        >
          {cards.map((c, ind) => (
            <CardMain
              key={c.id}
              name={c.name}
              image={c.img}
              onClick={() => setTopic({ ...c })}
              color1={cardColors[ind].color1}
              color2={cardColors[ind].color2}
            />
          ))}
        </Flex>

        <Heading
          as="h2"
          fontSize={{ base: "25px", sm: "34px", md: "46px" }}
          lineHeight="1.15"
          color={isDark ? "green.300" : "green.300"}
          textAlign="center"
          px={4}
          textShadow="0 3px 12px rgba(0,0,0,0.7)"
        >
          {t("becomeVirtualVolunteer")}
        </Heading>
      </Flex>
    </Box>
  );
}
