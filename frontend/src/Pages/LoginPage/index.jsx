import React, { useEffect } from "react";
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
  Text,
} from "@chakra-ui/react";
import { useColorMode } from "../../components/ui/color-mode";
import { useLoginMutation } from "../../Store/services/user";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { enqueueSnackbar } from "notistack";
import AdsLayout from "../../components/ads/AdsLayout";
import "../../colors.css";

import { useFormik } from "formik";
import * as Yup from "yup";

export default function LoginPage() {
  const { colorMode } = useColorMode();
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

  const validationSchema = Yup.object({
    username: Yup.string().required(t("required_field")),
    password: Yup.string().required(t("required_field")),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const data = await login({
          username: values.username,
          password: values.password,
        }).unwrap();
        
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        navigate("/");
      } catch (error) {
        console.error(error);
        enqueueSnackbar(t("login_error"), { variant: "error" });
      }
    },
  });

  const toggleLanguage = () => {
    const newLang = i18n.language === "uk" ? "en" : "uk";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  const getBorderColor = (fieldName) => {
    if (formik.touched[fieldName] && formik.errors[fieldName]) {
      return "red.400";
    }
    return isDark ? "gray.600" : "gray.200";
  };

  const addonStyles = {
    bg: isDark ? "gray.700" : "gray.50",
    color: isDark ? "gray.300" : "gray.600",
    fontWeight: "500",
    fontSize: "sm",
    minW: "160px",
    justifyContent: "flex-start",
    px: 4,
  };

  const inputStyles = {
    bg: isDark ? "gray.800" : "white",
    color: isDark ? "white" : "gray.800",
    _placeholder: { color: isDark ? "gray.500" : "gray.400" },
    _focus: {
      borderColor: isDark ? "blue.400" : "green.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
    },
    _hover: {
      borderColor: isDark ? "gray.500" : "gray.300",
    },
    transition: "all 0.2s",
    px: 4,
  };

  return (
    <AdsLayout>
      <Flex display="flex" justifyContent="center" py={10}>
        <Container
          flexDirection="column"
          alignItems="center"
          display="flex"
          justifyContent="center"
          maxW="md"
        >
          <Heading
            fontSize="3xl"
            textTransform="uppercase"
            letterSpacing="wider"
            fontWeight="400"
            color={isDark ? "white" : "gray.700"}
            mb={2}
          >
            {t("login")}
          </Heading>

          <Box
            fontSize="sm"
            textAlign="center"
            mb={6}
            color={isDark ? "gray.400" : "gray.500"}
          >
            {t("noaccount")}{" "}
            <Link
              onClick={() => navigate("/signup")}
              color={isDark ? "blue.400" : "green.600"}
              fontWeight="600"
              _hover={{ textDecoration: "underline" }}
            >
              {t("signup")}
            </Link>
          </Box>

          <Stack
            as="form"
            onSubmit={formik.handleSubmit}
            gap={5}
            w="full"
            p={{ base: 6, md: 10 }}
            borderRadius="2xl"
            bg={isDark ? "gray.800" : "white"}
            boxShadow={
              isDark
                ? "0 10px 40px rgba(0,0,0,0.4)"
                : "0 10px 40px rgba(0,0,0,0.08)"
            }
            border="1px solid"
            borderColor={isDark ? "gray.700" : "gray.100"}
          >
            <Box w="full">
              <Group attached w="full">
                <InputAddon {...addonStyles} borderColor={getBorderColor("username")}>
                  {t("loginname")}:
                </InputAddon>
                <Input
                  name="username"
                  placeholder={t("loginname")}
                  autoComplete="off"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  borderColor={getBorderColor("username")}
                  {...inputStyles}
                />
              </Group>
              {formik.touched.username && formik.errors.username && (
                <Text color="red.500" fontSize="xs" mt={1.5} ml={1}>
                  {formik.errors.username}
                </Text>
              )}
            </Box>

            <Box w="full">
              <Group attached w="full">
                <InputAddon {...addonStyles} borderColor={getBorderColor("password")}>
                  {t("password")}:
                </InputAddon>
                <Input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder={t("password")}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  borderColor={getBorderColor("password")}
                  {...inputStyles}
                />
              </Group>
              {formik.touched.password && formik.errors.password && (
                <Text color="red.500" fontSize="xs" mt={1.5} ml={1}>
                  {formik.errors.password}
                </Text>
              )}
            </Box>

            <Button
              type="submit"
              size="lg"
              w="full"
              mt={4}
              isLoading={formik.isSubmitting}
              bg={isDark ? "var(--main-dark-color)" : "var(--main-color)"}
              color="white"
              fontWeight="600"
              fontSize="md"
              letterSpacing="wide"
              borderRadius="xl"
              _hover={{
                bg: "#487738",
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              _active={{
                bg: "#375c2b",
                transform: "translateY(0)",
              }}
              transition="all 0.2s ease-in-out"
            >
              {t("login")}
            </Button>
          </Stack>
        </Container>
      </Flex>
    </AdsLayout>
  );
}