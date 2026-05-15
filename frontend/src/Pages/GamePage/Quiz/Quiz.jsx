import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  Image,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { FullscreenLoader } from "../../../components/Loader";
import ImgNo from "./no_image.jpg";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function QuizApp({ points, setPoints, topic }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [topicNum, setTopicNum] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questionImg, setQuestionImg] = useState(null);
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);

  const timerRef = useRef(null);

  useEffect(() => {
    if (loading || finished || questions.length === 0) return;

    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, finished, questions]);

  useEffect(() => {
    if (finished) {
      clearInterval(timerRef.current);
    }
  }, [finished]);

  useEffect(() => {
    if (loading || questions.length === 0) return;

    async function load() {
      const imgName = questions[current].keyword;
      await loadImage(imgName);
    }

    load();
  }, [current]);

  useEffect(() => {
    if (topic?.topics?.length) {
      loadQuiz(0);
    }
  }, [topic]);

  async function loadQuiz(nextTopicNum = topicNum) {
    setLoading(true);

    try {
      if (!topic || !topic.topics || !topic.topics[nextTopicNum]) {
        console.error("Немає теми для вікторини:", topic, nextTopicNum);
        setQuestions([]);
        setLoading(false);
        return;
      }

      const quizTopic = topic.topics[nextTopicNum];

      const res = await fetch(
        `http://localhost:8000/api/games/quiz/?topic=${encodeURIComponent(quizTopic)}`,
      );

      if (!res.ok) {
        throw new Error("Помилка сервера");
      }

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        console.error("Бекенд повернув порожній список питань:", data);
        setQuestions([]);
        setLoading(false);
        return;
      }

      setQuestions(data);
      setCurrent(0);
      setSelected(null);
      setFinished(false);
      setTime(0);
      setScore(0);
      setQuestionImg(null);

      if (data[0]?.keyword) {
        await loadImage(data[0].keyword);
      } else {
        setQuestionImg(ImgNo);
      }

      setLoading(false);
    } catch (err) {
      console.error("Load quiz error:", err);
      setQuestions([]);
      setLoading(false);
    }
  }

  async function loadImage(keyword) {
    try {
      const res = await fetch("http://localhost:8000/api/games/quiz_image/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setQuestionImg(data?.image || ImgNo);
    } catch (err) {
      console.error(" Load image error:", err);
      setQuestionImg(ImgNo);
    }
  }

  const answer = (index) => {
    if (selected !== null) return;

    setSelected(index);

    if (index === questions[current].right) {
      setScore((s) => s + 1);
      setPoints(points + 1);
    }

    setTimeout(() => {
      if (current + 1 === questions.length) {
        setFinished(true);
        setTopicNum(topicNum + 1);
      } else {
        setCurrent((c) => c + 1);
        setQuestionImg(null);
        setSelected(null);
      }
    }, 800);
  };

  const restart = () => {
    clearInterval(timerRef.current);

    setCurrent(0);
    setScore(0);
    setTime(0);
    setFinished(false);
    setSelected(null);
    setQuestionImg(null);

    loadQuiz();
  };

  if (loading) {
    return <FullscreenLoader text="Завантаження" />;
  }

  if (finished) {
    return (
      <Flex
        h="100vh"
        direction="column"
        align="center"
        justify="center"
        gap={4}
      >
        <Heading>🏁 Result</Heading>
        <Text fontSize="2xl">
          {score} / {questions.length}
        </Text>
        <Text>⏱ {time} sec</Text>

        <Button onClick={restart} colorScheme="teal">
          Restart
        </Button>
        <Button
            size="sm"
            width="5px"
            borderRadius="xl"
            p="5px"
            colorPalette="green"
            onClick={() => navigate("/")}
          >
            <IoChevronBack />
        </Button>
      </Flex>
    );
  }

  const q = questions[current];

  return (
  <Flex
    minH="100vh"
    direction={{ base: "column", md: "row" }}
    bg="black"
    color="white"
    pt={{ base: "90px", md: "90px" }}
  >
    <Flex
      w={{ base: "100%", md: "52%" }}
      minH={{ base: "auto", md: "calc(100vh - 90px)" }}
      p={{ base: 4, sm: 5, md: 8 }}
      direction="column"
      gap={{ base: 4, md: 6 }}
      justify="center"
      zIndex={2}
    >
      <HStack
        justify="space-between"
        w="100%"
        maxW="520px"
        mx="auto"
        fontSize={{ base: "sm", sm: "md", md: "lg" }}
        gap={3}
        bg="whiteAlpha.100"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="2xl"
        px={{ base: 3, md: 4 }}
        py={3}
        backdropFilter="blur(8px)"
      >
        <Text whiteSpace="nowrap">⏰ {time}s</Text>

        <Button
          size={{ base: "sm", md: "md" }}
          minW={{ base: "38px", md: "44px" }}
          h={{ base: "38px", md: "44px" }}
          borderRadius="xl"
          p={0}
          colorPalette="green"
          onClick={() => navigate("/")}
        >
          <IoChevronBack />
        </Button>

        <Text whiteSpace="nowrap">
          {current + 1} / {questions.length}
        </Text>

        <Text whiteSpace="nowrap">⭐ {score}</Text>
      </HStack>

      <Heading
        size={{ base: "md", sm: "lg", md: "xl" }}
        textAlign={{ base: "center", md: "left" }}
        lineHeight="1.35"
        maxW="520px"
        mx="auto"
        w="100%"
      >
        {q.question}
      </Heading>

      <Grid
        templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
        gap={{ base: 3, md: 4 }}
        w="100%"
        maxW="520px"
        mx="auto"
      >
        {q.answers.map((a, i) => {
          let bg = "blue.500";

          if (selected !== null) {
            if (i === q.right) bg = "green.400";
            else if (i === selected) bg = "red.400";
          }

          return (
            <Box
              key={i}
              onClick={() => answer(i)}
              color="white"
              bg={bg}
              minH={{ base: "58px", sm: "70px", md: "82px" }}
              borderRadius="xl"
              px={{ base: 3, md: 4 }}
              py={3}
              fontSize={{ base: "md", sm: "lg", md: "xl" }}
              fontWeight="600"
              textAlign="center"
              cursor="pointer"
              display="flex"
              alignItems="center"
              justifyContent="center"
              lineHeight="1.25"
              boxShadow="0 10px 25px rgba(0,0,0,0.3)"
              transition="0.2s ease"
              _hover={{
                opacity: 0.9,
                transform: selected === null ? "translateY(-3px)" : "none",
              }}
            >
              {a}
            </Box>
          );
        })}
      </Grid>
    </Flex>

    <Flex
      w={{ base: "100%", md: "48%" }}
      h={{ base: "260px", sm: "320px", md: "calc(100vh - 90px)" }}
      p={{ base: 4, md: 0 }}
      align="center"
      justify="center"
      bg="black"
    >
      <Box
        w="100%"
        h="100%"
        maxW={{ base: "520px", md: "none" }}
        borderRadius={{ base: "2xl", md: "0" }}
        overflow="hidden"
        bg="gray.900"
        boxShadow={{ base: "0 18px 45px rgba(0,0,0,0.45)", md: "none" }}
      >
        {questionImg ? (
          <Image
            src={questionImg}
            alt="question"
            objectFit="cover"
            w="100%"
            h="100%"
          />
        ) : (
          <Flex w="100%" h="100%" align="center" justify="center">
            <Spinner size="lg" color="green.400" />
          </Flex>
        )}
      </Box>
    </Flex>
  </Flex>
  );
}
