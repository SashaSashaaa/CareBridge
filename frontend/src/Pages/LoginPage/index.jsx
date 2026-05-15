import React from "react";
import {
  Button,
  Container,
  Heading,
  Group,
  Input,
  InputAddon,
  Stack,
  Box,
  Flex,
  Link,
} from "@chakra-ui/react";
import { useRef, useEffect } from "react";
import { useColorMode } from "../../components/ui/color-mode";
import { useLoginMutation } from "../../Store/services/user";
import { redirect, useNavigate } from "react-router";

import { useTranslation } from "react-i18next";
import AdsLayout from "../../components/ads/AdsLayout";

export default function LoginPage() {
  const { colorMode, toggleColorMode } = useColorMode();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isDark = colorMode === "dark";

  const onLogin = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    login({ username, password })
      .unwrap()
      .then((data) => {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        navigate("/");
      });
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "uk" ? "en" : "uk";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  useEffect(() => {
    document.documentElement.style.overflowY = "scroll";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflowY = "";
      document.body.style.overflow = "";
    };
  }, []);
   

  return (
    <AdsLayout>
      <Flex display="flex" justifyContent="center">
        <Container
          flexDirection="column"
          alignItems="center"
          display="flex"
          justifyContent="center"
        >
          <Heading
            fontSize={"4xl"}
            textTransform={"uppercase"}
            letterSpacing="widest"
            fontWeight="300"
            color={isDark ? "white" : "gray.800"}
            mb={2}
          >
            {t("login")}
          </Heading>

          <Box
            fontSize="sm"
            textAlign="center"
            mt={4}
            color={isDark ? "gray.400" : "gray.600"}
          >
            {t("noaccount")}
            <Link
              onClick={() => navigate("/signup")}
              color={isDark ? "blue.400" : "blue.500"}
            >
              {t("signup")}
            </Link>
          </Box>

          <Stack
            gap="3"
            w={300}
            p={8}
            borderRadius="xl"
            border="1px solid"
            borderColor={isDark ? "gray.700" : "gray.200"}
            boxShadow="var(--shadow-color)"
            mt={6}
            bg="rgba(255, 255, 255, 0.06)"
            box-shadow="var(--shadow-color)"
            backdropFilter="blur(15px)"
          >
            <Group attached>
              <InputAddon
                bg={isDark ? "gray.800" : "gray.100"}
                color={isDark ? "gray.400" : "gray.500"}
                borderColor={isDark ? "gray.600" : "gray.300"}
                fontSize="sm"
                minW="110px"
              >
                {t("loginname")}:
              </InputAddon>
              <Input
                ref={usernameRef}
                placeholder={t("loginname")}
                autoComplete="off"
                bg={isDark ? "gray.800" : "white"}
                borderColor={isDark ? "gray.600" : "gray.300"}
                color={isDark ? "white" : "gray.800"}
                _placeholder={{ color: isDark ? "gray.500" : "gray.400" }}
                _focus={{
                  borderColor: isDark ? "blue.400" : "blue.500",
                  boxShadow: "var(--shadow-color)",
                }}
              />
            </Group>

            <Group attached>
              <InputAddon
                bg={isDark ? "gray.800" : "gray.100"}
                color={isDark ? "gray.400" : "gray.500"}
                borderColor={isDark ? "gray.600" : "gray.300"}
                fontSize="sm"
                minW="110px"
              >
                {t("password")}:
              </InputAddon>
              <Input
                ref={passwordRef}
                type="password"
                autoComplete="new-password"
                placeholder={t("password")}
                bg={isDark ? "gray.800" : "white"}
                borderColor={isDark ? "gray.600" : "gray.300"}
                color={isDark ? "white" : "gray.800"}
                _placeholder={{ color: isDark ? "gray.500" : "gray.400" }}
                _focus={{
                  borderColor: isDark ? "blue.400" : "blue.500",
                  boxShadow: "var(--shadow-color)",
                }}
              />
            </Group>
            <Button
              onClick={onLogin}
              w="full"
              mt={2}
              bg={isDark ? "var(--main-dark-color)" : "var(--main-color)"}
              color="white"
              fontWeight="500"
              letterSpacing="wide"
              borderRadius="lg"
              _hover={{
                bg: "#487738",
                transform: "translateY(-1px)",
                boxShadow: "var(--shadow-color)",
              }}
              _active={{
                bg: "#375c2b",
                transform: "translateY(0)",
              }}
              transition="all 0.2s"
            >
              {t("login")}
            </Button>
          </Stack>
        </Container>
      </Flex>
    </AdsLayout>
  );
}
