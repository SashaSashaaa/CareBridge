import React, { useEffect } from "react";
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
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { useSignupMutation, useLoginMutation } from "../../Store/services/user";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import AdsLayout from "../../components/ads/AdsLayout";
import "../../colors.css";

import { useFormik } from "formik";
import * as Yup from "yup";

export default function RegisterPage() {
  const { colorMode } = useColorMode();
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

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t("min_username"))
      .required(t("required_field")),
    email: Yup.string()
      .email(t("invalid_email"))
      .required(t("required_field")),
    first_name: Yup.string()
      .min(2, t("min_firstname"))
      .required(t("required_field")),
    last_name: Yup.string()
      .min(2, t("min_lastname"))
      .required(t("required_field")),
    password: Yup.string()
      .min(8, t("min_password"))
      .required(t("required_field")),
    confPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t("passwords_mismatch"))
      .required(t("required_field")),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await register({
          username: values.username,
          password: values.password,
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
        }).unwrap();

        await login({ username: values.username, password: values.password }).unwrap();

        enqueueSnackbar(t("register_success"), { variant: "success" });
        navigate("/");
      } catch (error) {
        console.error(error);
        if (error?.data) {
          console.log("Помилка від сервера:", error.data);
        }
        enqueueSnackbar(t("register_error"), { variant: "error" });
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
            {t("signup")}
          </Heading>

          <Box
            fontSize="sm"
            textAlign="center"
            mb={6}
            color={isDark ? "gray.400" : "gray.500"}
          >
            {t("haveaccount")}{" "}
            <Link
              onClick={() => navigate("/login")}
              color={isDark ? "blue.400" : "green.600"}
              fontWeight="600"
              _hover={{ textDecoration: "underline" }}
            >
              {t("login")}
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
                <InputAddon {...addonStyles} borderColor={getBorderColor("email")}>
                  {t("email")}:
                </InputAddon>
                <Input
                  name="email"
                  type="email"
                  placeholder={t("email")}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  borderColor={getBorderColor("email")}
                  {...inputStyles}
                />
              </Group>
              {formik.touched.email && formik.errors.email && (
                <Text color="red.500" fontSize="xs" mt={1.5} ml={1}>
                  {formik.errors.email}
                </Text>
              )}
            </Box>

            <Box w="full">
              <Group attached w="full">
                <InputAddon {...addonStyles} borderColor={getBorderColor("first_name")}>
                  {t("firstname")}:
                </InputAddon>
                <Input
                  name="first_name"
                  type="text"
                  placeholder={t("firstname")}
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  borderColor={getBorderColor("first_name")}
                  {...inputStyles}
                />
              </Group>
              {formik.touched.first_name && formik.errors.first_name && (
                <Text color="red.500" fontSize="xs" mt={1.5} ml={1}>
                  {formik.errors.first_name}
                </Text>
              )}
            </Box>

            <Box w="full">
              <Group attached w="full">
                <InputAddon {...addonStyles} borderColor={getBorderColor("last_name")}>
                  {t("lastname")}:
                </InputAddon>
                <Input
                  name="last_name"
                  type="text"
                  placeholder={t("lastname")}
                  autoComplete="off"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  borderColor={getBorderColor("last_name")}
                  {...inputStyles}
                />
              </Group>
              {formik.touched.last_name && formik.errors.last_name && (
                <Text color="red.500" fontSize="xs" mt={1.5} ml={1}>
                  {formik.errors.last_name}
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
                  placeholder={t("password")}
                  autoComplete="new-password"
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

            <Box w="full">
              <Group attached w="full">
                <InputAddon {...addonStyles} borderColor={getBorderColor("confPassword")}>
                  {t("confirmpassword")}:
                </InputAddon>
                <Input
                  name="confPassword"
                  type="password"
                  placeholder={t("confirmpassword")}
                  value={formik.values.confPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  borderColor={getBorderColor("confPassword")}
                  {...inputStyles}
                />
              </Group>
              {formik.touched.confPassword && formik.errors.confPassword && (
                <Text color="red.500" fontSize="xs" mt={1.5} ml={1}>
                  {formik.errors.confPassword}
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
              {t("signup")}
            </Button>
          </Stack>
        </Container>
      </Flex>
    </AdsLayout>
  );
}