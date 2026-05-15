import { useState } from "react";
import { motion } from "framer-motion";
import Quiz from "./Quiz/Quiz";

import Game1 from "./GameAI/Game1/Game1";
import TravelGame from "./GameAI/Game2/Game2";
import FarmingGame from "./GameAI/Game3/Game3";

import StartPage from "./StartPage/index";
import TopBar from "../../components/TopControl";
import GameProgrammingDescription from "./GameAI/Game1/Game1Description";
import GameTourismDescription from "./GameAI/Game2/Game2Description";
import GamePlantingDescription from "./GameAI/Game3/Game3Description";
import VolunteerDialog from "./VolunteerDialogue";
import { Box } from "@chakra-ui/react";

export default function AppGame() {
  const [screen, setScreen] = useState("quiz");
  const [points, setPoints] = useState(0);

  const [showBasicDescription, setShowBasicDescription] = useState(true);

  const [gameDescription, setGameDescription] = useState(null);
  const [game, setGame] = useState(null);

  const [topic, setTopic] = useState(null);

  function setGameByName() {
    setGame(gameDescription);
    setGameDescription(false);
  }

  if (!topic)
    return (
      <StartPage
        setTopic={(t) => {
          setTopic(t);
          setGameDescription(t.id);
        }}
      />
    );

  if (showBasicDescription) {
    return (
      <VolunteerDialog
        isOpen={true}
        onClose={() => setShowBasicDescription(false)}
      />
    );
  }

  switch (gameDescription) {
    case "programming":
      return (
        <GameProgrammingDescription isOpen={true} onClose={setGameByName} />
      );
    case "tourism":
      return <GameTourismDescription isOpen={true} onClose={setGameByName} />;
    case "planting":
      return <GamePlantingDescription isOpen={true} onClose={setGameByName} />;
  }

  // вибір гри
  let currentGame = 0;
  switch (game) {
    case "programming":
      currentGame = <Game1 points={points} setPoints={setPoints} />;
      break;
    case "tourism":
      currentGame = <TravelGame points={points} setPoints={setPoints} />;
      break;
    case "planting":
      currentGame = <FarmingGame points={points} setPoints={setPoints} />;
      break;
  }

  return (
  <Box
    w="100vw"
    h="100dvh"
    overflow="hidden"
    position="relative"
  >
    <motion.div
      animate={{ x: screen === "quiz" ? "0%" : "-50%" }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        width: "200vw",
        height: "100dvh",
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Quiz
          topic={topic}
          setPoints={setPoints}
          points={points}
          goGame={() => setScreen("game")}
        />
      </div>

      <div
        style={{
          width: "100vw",
          height: "100dvh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {currentGame}
      </div>
    </motion.div>

    <TopBar
      points={points}
      mode={screen === "game"}
      switchMode={() => {
        setScreen(screen === "game" ? "quiz" : "game");
      }}
    />
  </Box>
);
}
