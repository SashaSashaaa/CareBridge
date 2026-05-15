import React from "react";
import { Box, Text, Heading, Flex, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);
const MotionFlex = motion(Flex);

export default function AudienceCard({
  index,
  title,
  text,
  icon,
  cardBg,
  cardText,
  mutedText,
  borderColor,
  softShadow,
}) {
  const isOdd = index % 2 !== 0;

  return (
    <MotionBox
      bg={cardBg}
      color={cardText}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="34px"
      p={7}
      boxShadow={softShadow}
      position="relative"
      overflow="hidden"
      transition="0.2s"
      _hover={{
        transform: "translateY(-4px)",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <MotionText
        position="absolute"
        right="28px"
        top="16px"
        fontSize="7xl"
        fontWeight="950"
        color="green.300"
        opacity="0.18"
        lineHeight="1"
        zIndex={0}
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: "linear", delay: 0.2 }}
      >
        0{index + 1}
      </MotionText>

      <MotionFlex
        w="64px"
        h="64px"
        borderRadius="24px"
        align="center"
        justify="center"
        bg="var(--linear-main)"
        color="white"
        mb={5}
        boxShadow="0 12px 28px rgba(0,0,0,0.18)"
        position="relative"
        zIndex={1}
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: "linear", delay: 0.3 }}
      >
        <Icon as={icon} boxSize={7} />
      </MotionFlex>

      <MotionHeading
        fontSize="2xl"
        mb={3}
        position="relative"
        zIndex={1}
        initial={{ opacity: 0, x: isOdd ? 80 : -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: "linear", delay: 0.45 }}
      >
        {title}
      </MotionHeading>

      <MotionText
        color={mutedText}
        lineHeight="1.8"
        position="relative"
        zIndex={1}
        initial={{ opacity: 0, x: isOdd ? -80 : 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: "linear", delay: 0.6 }}
      >
        {text}
      </MotionText>
    </MotionBox>
  );
}