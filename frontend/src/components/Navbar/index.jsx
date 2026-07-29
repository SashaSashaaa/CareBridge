import {
  Flex,
  Box,
  Link,
  Button,
  Image,
  Text,
  Heading,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useColorMode } from "../ui/color-mode";
import { LuMoon, LuSun, LuMenu, LuX } from "react-icons/lu";
import { IconButton } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import LogoImg from "./logo.svg";
import MainPage from "../../Pages/MainPage";
import AboutPage from "../../Pages/AboutPage";
import PsychologistPage from "../../Pages/AISupportPage";
import VolunteerPage from "../../Pages/VolunteerPage";
import LoginPage from "../../Pages/LoginPage";
import RegisterPage from "../../Pages/RegisterPage";
import ProfilePage from "../../Pages/ProfilePage";
import "../../colors.css";

import { useTranslation } from "react-i18next";

import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";

import { useNavigate, useLocation } from "react-router";
import { useGetUserQuery, useLogoutMutation } from "../../Store/services/user";
import "./style.css";
import { Underline } from "lucide-react";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [logout] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);
  const [openVolunteer, setOpenVolunteer] = useState(false);
  const [openPsychologist, setOpenPsychologist] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (window.innerWidth <= 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 90) {
          setHideHeader(true);
          setMobileMenuOpen(false);
        } else if (currentScrollY < lastScrollY - 6) {
          setHideHeader(false);
        }
      } else {
        setHideHeader(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const isVolunteerActive =
    location.pathname.startsWith("/volunteers") ||
    location.pathname.startsWith("/stories") ||
    location.pathname.startsWith("/articles");

  const linkStyles = (active) => ({
    color: active ? "var(--main-color)" : "var(--light-color)",
    fontWeight: active ? "700" : "600",
    bg: active ? "rgba(255, 255, 255, 0.64)" : "transparent",
    px: "14px",
    py: "8px",
    borderRadius: "14px",
    textDecoration: "none",
    transition: "0.2s ease",
    cursor: "pointer",
  });

  const { data: userData, isLoading, isError } = useGetUserQuery();
  const { t, i18n } = useTranslation();

  const onLogout = () => {
    logout()
      .unwrap()
      .then((data) => {
        console.log(data);
      });
  };

  const onMenuClick = ({ value }) => {
    if (value === "logout") {
      onLogout();
      navigate("/");
      return;
    }
    navigate("/" + value);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "uk" ? "en" : "uk";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  const languages = [
    { code: "en", label: "ENGLISH", flag: "🇬🇧" },
    { code: "uk", label: "УКРАЇНСЬКА", flag: "🇺🇦" },
  ];

  if (isLoading) {
    return "";
  }

  // console.log(userData)

  return (
    <Flex
      className={`fixed-header ${hideHeader ? "hide-navbar" : ""}`}
      m="auto"
    >
      <div className="blur">
        <Image src={LogoImg} onClick={() => navigate("/")} w={170} />
      </div>

      <Box
        className="header"
        bg={"var(--linear-main)"}
        boxShadow={"var(--shadow-color)"}
      >
        <Box className="desktop-nav-links">
          <Link
            {...linkStyles(isActive("/"))}
            _hover={{ textDecoration: "underline" }}
            onClick={() => navigate("/")}
          >
            {t("home")}
          </Link>

          <Link
            {...linkStyles(isActive("/about"))}
            _hover={{ textDecoration: "underline" }}
            onClick={() => navigate("/about")}
          >
            {t("about")}
          </Link>

          <MenuRoot onSelect={({ value }) => navigate("/" + value)}>
            <MenuTrigger asChild>
              <Link
                {...linkStyles(isVolunteerActive)}
                _hover={{ textDecoration: "underline" }}
              >
                {t("volunteer")}
              </Link>
            </MenuTrigger>
            <MenuContent
              className="shadow"
              p={2}
              borderRadius="20px"
              background="rgba(255, 255, 255, 0.06)"
              backdropFilter="blur(15px)"
              fontWeight="800"
              border="1px solid rgba(255, 255, 255, 0.2)"
            >
              <MenuItem
                mt={2}
                mb={2}
                _hover={{ textDecoration: "underline" }}
                bg={colorMode === "dark" ? "gray.800" : "gray.400"}
                color="white"
                p={1}
                borderRadius="5px"
                cursor="pointer"
                fontSize="lg"
                value="volunteers"
              >
                {t("volunteer")}
              </MenuItem>
              <MenuItem
                mt={2}
                mb={2}
                _hover={{ textDecoration: "underline" }}
                bg={colorMode === "dark" ? "gray.800" : "gray.400"}
                color="white"
                p={1}
                borderRadius="5px"
                cursor="pointer"
                fontSize="lg"
                value="articles"
              >
                {t("article")}
              </MenuItem>
              <MenuItem
                mt={2}
                mb={2}
                _hover={{ textDecoration: "underline" }}
                bg={colorMode === "dark" ? "gray.800" : "gray.400"}
                color="white"
                p={1}
                borderRadius="5px"
                cursor="pointer"
                fontSize="lg"
                value="stories"
              >
                {t("stories")}
              </MenuItem>
            </MenuContent>
          </MenuRoot>

          <Link
            {...linkStyles(isActive("/aisupport"))}
            _hover={{ textDecoration: "underline" }}
            onClick={() => navigate("/aisupport")}
          >
            {t("aiSupport")}
          </Link>

          <Link
            {...linkStyles(isActive("/games"))}
            _hover={{ textDecoration: "underline" }}
            onClick={() => navigate("/games")}
          >
            {t("game")}
          </Link>
        </Box>

        <IconButton
          className="burger-btn shadow"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          bg="rgba(255,255,255,0.25)"
          color="white"
          borderRadius="full"
          aria-label="menu"
        >
          {mobileMenuOpen ? <LuX /> : <LuMenu />}
        </IconButton>

        <button
          className={`toggle ${colorMode === "light" ? "day" : "night"}`}
          onClick={toggleColorMode}
        >
          <span className="icon icon-left">
            {colorMode === "light" && <LuSun />}
          </span>
          <div className="knob" />
          <span className="icon icon-right">
            {colorMode === "dark" && <LuMoon />}
          </span>
        </button>
        <MenuRoot>
          <MenuTrigger className="lang" asChild>
            <Button
              h={{ base: "32px", sm: "34px", md: "42px", lg: "46px" }}
              minW={{ base: "58px", sm: "64px", md: "82px", lg: "100px" }}
              w={{ base: "58px", sm: "64px", md: "82px", lg: "100px" }}
              fontSize={{ base: "15px", sm: "16px", md: "20px", lg: "24px" }}
              className="shadow"
              ml={{ base: 0, md: 1, lg: 3 }}
              px={{ base: 1, sm: 2, md: 3 }}
              bg={colorMode === "dark" ? "gray.700" : "gray.200"}
              color={colorMode === "dark" ? "white" : "black"}
              borderRadius="full"
            >
              {languages.find((l) => l.code === i18n.language)?.flag}{" "}
              {i18n.language === "uk" ? "UA" : "EN"}
            </Button>
          </MenuTrigger>
          <MenuContent
            p={2}
            borderRadius="20px"
            background="rgba(255, 255, 255, 0.06)"
            box-shadow="var(--shadow-color)"
            backdropFilter="blur(15px)"
            border="1px solid rgba(255, 255, 255, 0.2)"
          >
            {languages.map((lang) => (
              <MenuItem
                key={lang.code}
                value={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  localStorage.setItem("lang", lang.code);
                }}
                bg={colorMode === "dark" ? "gray.800" : "gray.400"}
                color="white"
                cursor="pointer"
                p={1}
                borderRadius="5px"
                mt={2}
                mb={2}
                fontSize="lg"
                fontWeight="800"
              >
                {lang.flag} {lang.label}
                {i18n.language === lang.code && (
                  <span style={{ marginLeft: "auto", color: "green" }}>✅</span>
                )}
              </MenuItem>
            ))}
          </MenuContent>
        </MenuRoot>

        <MenuRoot onSelect={onMenuClick}>
          <MenuTrigger asChild>
            <IconButton
              className="shadow profile-btn"
              bg={colorMode === "dark" ? "gray.700" : "gray.200"}
              color={colorMode === "dark" ? "white" : "black"}
              borderRadius={"full"}
              ml={{ base: 0, md: 4, lg: 10 }}
              size={{ base: "sm", md: "md", lg: "xl" }}
            >
              <FaUser />
            </IconButton>
          </MenuTrigger>
          <MenuContent
            className="shadow"
            backdropFilter="blur(15px)"
            fontWeight="800"
            p={2}
            borderRadius="20px"
            background="rgba(255, 255, 255, 0.06)"
            backdropFilter="blur(10px)"
            border="1px solid rgba(255, 255, 255, 0.2)"
          >
            {userData && userData.username ? (
              <>
                <MenuItem
                  mt={2}
                  mb={2}
                  fontSize="lg"
                  _hover={{ textDecoration: "underline" }}
                  bg={colorMode === "dark" ? "gray.800" : "gray.400"}
                  color="white"
                  cursor="pointer"
                  p={1}
                  borderRadius="5px"
                  value="profile"
                >
                  {t("profile")}
                </MenuItem>
                <MenuItem
                  mt={2}
                  mb={2}
                  fontSize="lg"
                  _hover={{ textDecoration: "underline" }}
                  bg={colorMode === "dark" ? "gray.800" : "gray.400"}
                  color="white"
                  cursor="pointer"
                  p={1}
                  borderRadius="5px"
                  value="chat"
                >
                  {t("chat")}
                </MenuItem>
                <MenuItem
                  mt={2}
                  mb={2}
                  fontSize="lg"
                  _hover={{ textDecoration: "underline" }}
                  bg={colorMode === "dark" ? "gray.800" : "gray.400"}
                  color="white"
                  cursor="pointer"
                  p={1}
                  borderRadius="5px"
                  value="logout"
                >
                  {t("logout")}
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  mt={2}
                  mb={2}
                  fontSize="lg"
                  _hover={{ textDecoration: "underline" }}
                  bg={colorMode === "dark" ? "gray.800" : "gray.400"}
                  color="white"
                  cursor="pointer"
                  p={1}
                  borderRadius="5px"
                  value="login"
                >
                  {" "}
                  {t("login")}{" "}
                </MenuItem>
                <MenuItem
                  mt={2}
                  mb={2}
                  fontSize="lg"
                  _hover={{
                    textDecoration: "underline",
                  }}
                  bg={colorMode === "dark" ? "gray.800" : "gray.400"}
                  color="white"
                  cursor="pointer"
                  p={1}
                  borderRadius="5px"
                  value="signup"
                >
                  {t("signup")}
                </MenuItem>
              </>
            )}
          </MenuContent>
        </MenuRoot>
        {mobileMenuOpen && (
          <Box className="mobile-nav-menu">
            <Link
              {...linkStyles(isActive("/"))}
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
              }}
              _hover={{ textDecoration: "underline" }}
            >
              {t("home")}
            </Link>

            <Link
              {...linkStyles(isActive("/about"))}
              onClick={() => {
                navigate("/about");
                setMobileMenuOpen(false);
              }}
              _hover={{ textDecoration: "underline" }}
            >
              {t("about")}
            </Link>

            <Link
              {...linkStyles(isActive("/volunteers"))}
              onClick={() => {
                navigate("/volunteers");
                setMobileMenuOpen(false);
              }}
              _hover={{ textDecoration: "underline" }}
            >
              {t("volunteer")}
            </Link>

            <Link
              {...linkStyles(isActive("/articles"))}
              onClick={() => {
                navigate("/articles");
                setMobileMenuOpen(false);
              }}
              _hover={{ textDecoration: "underline" }}
            >
              {t("article")}
            </Link>

            <Link
              {...linkStyles(isActive("/stories"))}
              onClick={() => {
                navigate("/stories");
                setMobileMenuOpen(false);
              }}
              _hover={{ textDecoration: "underline" }}
            >
              {t("stories")}
            </Link>

            <Link
              {...linkStyles(isActive("/aisupport"))}
              onClick={() => {
                navigate("/aisupport");
                setMobileMenuOpen(false);
              }}
              _hover={{ textDecoration: "underline" }}
            >
              {t("aiSupport")}
            </Link>

            <Link
              {...linkStyles(isActive("/games"))}
              onClick={() => {
                navigate("/games");
                setMobileMenuOpen(false);
              }}
              _hover={{ textDecoration: "underline" }}
            >
              {t("game")}
            </Link>
          </Box>
        )}
      </Box>
    </Flex>
  );
}
