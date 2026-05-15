import React from "react";
import { useColorMode } from "../../components/ui/color-mode";
import {
  Button,
  Container,
  Heading,
  Box,
  Flex,
  Group,
  Input,
  InputAddon,
  Stack,
  Link,
} from "@chakra-ui/react";
import { redirect, useNavigate } from "react-router";
import { useRef, useEffect } from "react";
import { useSignupMutation, useLoginMutation } from "../../Store/services/user";
import { enqueueSnackbar } from "notistack";
import "../../colors.css";
import { useTranslation } from "react-i18next";
import AdsLayout from "../../components/ads/AdsLayout";

export default function RegisterPage() {
  const { colorMode, toggleColorMode } = useColorMode();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confPasswordRef = useRef(null);
  const emailRef = useRef(null);
  const firstnameRef = useRef(null);
  const lastnameRef = useRef(null);

  const [register] = useSignupMutation();
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isDark = colorMode === "dark";

  useEffect(() => {
    document.documentElement.style.overflowY = "scroll";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflowY = "";
      document.body.style.overflow = "";
    };
  }, []);
    
  const onRegister = async () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const passwordconf = confPasswordRef.current.value;
    const email = emailRef.current.value;
    const first_name = firstnameRef.current.value;
    const last_name = lastnameRef.current.value;

    if (password !== passwordconf) {
      enqueueSnackbar("Паролі не співпадають", { variant: "error" });
      return;
    }

    try {
      await register({
        username,
        password,
        email,
        first_name,
        last_name,
      }).unwrap();

      await login({ username, password }).unwrap();

      enqueueSnackbar("Реєстрація успішна", { variant: "success" });
      navigate("/");
    } catch (error) {
      console.error(error);

      if (error?.data) {
        console.log("Помилка від сервера:", error.data);
      }

      enqueueSnackbar("Реєстрація або вхід не вдалися", { variant: "error" });
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "uk" ? "en" : "uk";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

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
            {t("signup")}
          </Heading>

          <Box
            fontSize="sm"
            textAlign="center"
            mt={4}
            color={isDark ? "gray.400" : "gray.600"}
          >
            {t("haveaccount")}
            <Link
              onClick={() => navigate("/login")}
              color={isDark ? "blue.400" : "blue.500"}
            >
              {t("login")}
            </Link>
          </Box>

          <Stack
            gap="3"
            w={400}
            p={8}
            borderRadius="xl"
            border="1px solid"
            borderColor={isDark ? "gray.700" : "gray.200"}
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
                minW="125px"
              >
                {t("loginname")}:
              </InputAddon>
              <Input
                ref={usernameRef}
                placeholder={t("loginname")}
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
                minW="125px"
              >
                {t("email")}:
              </InputAddon>
              <Input
                ref={emailRef}
                type="email"
                placeholder={t("email")}
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
                minW="125px"
              >
                {t("firstname")}:
              </InputAddon>
              <Input
                ref={firstnameRef}
                type="text"
                placeholder={t("firstname")}
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
                minW="125px"
              >
                {t("lastname")}:
              </InputAddon>
              <Input
                ref={lastnameRef}
                type="text"
                placeholder={t("lastname")}
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
                minW="125px"
              >
                {t("password")}:
              </InputAddon>
              <Input
                ref={passwordRef}
                type="password"
                placeholder={t("password")}
                autoComplete="new-password"
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
                minW="125px"
              >
                {t("confirmpassword")}:
              </InputAddon>
              <Input
                ref={confPasswordRef}
                type="password"
                placeholder={t("confirmpassword")}
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
              onClick={onRegister}
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
              {t("signup")}
            </Button>
          </Stack>
        </Container>
      </Flex>
    </AdsLayout>
  );
}
