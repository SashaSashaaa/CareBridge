import { Box, Flex } from "@chakra-ui/react";
import SideAds from "./SideAds";

export default function AdsLayout({ children }) {
  return (
    <Flex
      w="100%"
      maxW="1500px"
      mx="auto"
      px={{ base: 4, md: 6 }}
      gap={6}
      align="flex-start"
    >
      <SideAds position="left" />

      <Box flex="1" minW={0}>
        {children}
      </Box>

      <SideAds position="right" />
    </Flex>
  );
}
