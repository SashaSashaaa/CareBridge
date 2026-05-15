import React from "react";
import { Box, Text, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

export default function HowCard({ number, title, text }) {
  return (
    <MotionBox
      bg="whiteAlpha.220"
      border="1px solid"
      borderColor="whiteAlpha.300"
      borderRadius="32px"
      p={7}
      backdropFilter="blur(8px)"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: "linear" }}
    >
      <MotionText
        fontSize="5xl"
        fontWeight="950"
        color="yellow.200"
        mb={4}
        // initial={{ opacity: 0, x: number % 2 ? 100 : -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1, ease: "linear", delay: 0.5 }}
      >
        {number}
      </MotionText>

      <MotionHeading
        fontSize="2xl"
        mb={3}
        // initial={{ scale: 0, x: number % 2 ? 100 : -100 }}
        whileInView={{ scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1, ease: "linear", delay: 0.5 }}
      >
        {title}
      </MotionHeading>

      <MotionText
        color="whiteAlpha.900"
        lineHeight="1.8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: "linear", delay: 1 }}
      >
        {text}
      </MotionText>
    </MotionBox>
  );
}
