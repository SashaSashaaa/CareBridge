import { Text, Button, Card, Input, Grid, HStack, Box } from "@chakra-ui/react";

const Counter = ({ label, value, onChange, max }) => {
  const setValue = (newValue) => {
    onChange(Math.min(max, Math.max(0, newValue)));
  };

  return (
    <Card.Root
      p={{ base: 2, md: 3 }}
      w="100%"
      bg="blackAlpha.500"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="xl"
      overflow="hidden"
    >
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "1fr auto auto",
        }}
        gap={{ base: 2, sm: 3 }}
        alignItems="center"
      >
        <Text
          fontWeight="medium"
          fontSize={{ base: "sm", md: "md" }}
          whiteSpace="normal"
          wordBreak="break-word"
        >
          {label}
        </Text>

        <HStack gap={1} justify={{ base: "space-between", sm: "center" }}>
          <Button
            size="xs"
            minW="32px"
            px={2}
            onClick={() => setValue(value - 1)}
            colorPalette="orange"
          >
            -
          </Button>

          <Input
            value={value}
            onChange={(e) => {
              const val = Number(e.target.value);

              if (!isNaN(val)) {
                setValue(val);
              }
            }}
            textAlign="center"
            width={{ base: "55px", md: "65px" }}
            size="xs"
            p={1}
          />

          <Button
            size="xs"
            minW="32px"
            px={2}
            onClick={() => setValue(value + 1)}
            colorPalette="green"
          >
            +
          </Button>
        </HStack>

        <HStack
          gap={1}
          justify={{ base: "space-between", sm: "center" }}
          w={{ base: "100%", sm: "auto" }}
        >
          <Button
            size="xs"
            flex={{ base: 1, sm: "unset" }}
            colorPalette="red"
            onClick={() => onChange(0)}
          >
            0
          </Button>

          <Button
            size="xs"
            flex={{ base: 1, sm: "unset" }}
            colorPalette="orange"
            onClick={() => onChange(Math.floor(max / 2))}
          >
            ½
          </Button>

          <Button
            size="xs"
            flex={{ base: 1, sm: "unset" }}
            colorPalette="green"
            onClick={() => onChange(max)}
          >
            MAX
          </Button>
        </HStack>
      </Grid>
    </Card.Root>
  );
};

export default Counter;