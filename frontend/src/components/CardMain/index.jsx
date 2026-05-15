import { Flex, Heading, Image } from "@chakra-ui/react";
import React from "react";

export default function CardMain({ name, image, onClick, color1, color2 }) {
  return (
    <Flex
      as="button"
      onClick={onClick}
      w={["100%", "280px", "300px" ]}
      maxW={[ "330px", "280px", "300px" ]}
      minH={[ "180px", "270px", "310px" ]}
      p={[ 5, 7 ]}
      direction="column"
      justify="space-between"
      align="center"
      gap={4}
      cursor="pointer"
      background={`linear-gradient(45deg, ${color1}, ${color2})`}
      borderRadius="2xl"
      border="none"
      boxShadow="0 18px 45px rgba(0,0,0,0.35)"
      transition="all 0.25s ease"
      overflow="hidden"
      _hover={{
        transform: "translateY(-6px) scale(1.03)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      }}
      _active={{
        transform: "scale(0.97)",
      }}
    >
      <Heading
        as="h3"
        fontSize={{ base: "24px", sm: "22px", md: "30px" }}
        color="white"
        textAlign="center"
        lineHeight="1.15"
        textShadow="0 2px 8px rgba(0,0,0,0.35)"
        wordBreak="break-word"
      >
        {name}
      </Heading>

      <Image
        src={image}
        alt={name}
        maxW={{ base: "100px", sm: "110px", md: "150px" }}
        maxH={{ base: "100px", sm: "130px", md: "170px" }}
        objectFit="contain"
        pointerEvents="none"
      />
    </Flex>
  );
}
