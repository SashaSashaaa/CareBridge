import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "./Layouts/MainLayout";
import MainPage from "./Pages/MainPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";

import VolunteerPage from "./Pages/VolunteerPage/index";
import EditVolunteerPage from "./Pages/VolunteerPage/EditVolunteerPage";
import VolunteerDetailPage from "./Pages/VolunteerPage/VolunteerDetailPage";
import VolunteerCard from "./Pages/VolunteerPage/VolunteerCard";
import CreateVolunteerPage from "./Pages/VolunteerPage/CreateVolunteerPage";

import ArticlePage from "./Pages/ArticlePage/index";
import EditArticlePage from "./Pages/ArticlePage/EditArticlePage";
import ArticleDetailPage from "./Pages/ArticlePage/ArticleDetailPage";
import ArticleCard from "./Pages/ArticlePage/ArticleCard";
import CreateArticlePage from "./Pages/ArticlePage/CreateArticlePage";

import StoryPage from "./Pages/StoryPage/index";
import EditStoryPage from "./Pages/StoryPage/EditStoryPage";
import StoryCard from "./Pages/StoryPage/StoryCard";
import CreateStoryPage from "./Pages/StoryPage/CreateStoryPage";

import AISupportPage from "./Pages/AISupportPage";
import AboutPage from "./Pages/AboutPage";
import ProfilePage from "./Pages/ProfilePage/index";
import AppGame from "./Pages/GamePage/AppGame";

import ChatPage from "./Pages/Chat/ChatPage";

import { ColorModeProvider, useColorMode } from "@/components/ui/color-mode";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { store } from "./Store/store";
import { Provider as ReduxProvider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { Provider } from "@/components/ui/provider";

function App() {
  return (
    <SnackbarProvider>
      <ReduxProvider store={store}>
        <Provider>
          <ColorModeProvider>
            <BrowserRouter>
              <Routes>
                <Route path="" element={<MainLayout />}>
                  <Route index element={<MainPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="signup" element={<RegisterPage />} />

                  <Route path="volunteers" element={<VolunteerPage />} />
                  <Route path="volunteers/:id" element={<VolunteerDetailPage />} />
                  <Route path="volunteers/:id/edit" element={<EditVolunteerPage />} />
                  <Route path="volunteers/create" element={<CreateVolunteerPage />} />

                  <Route path="articles" element={<ArticlePage />} />
                  <Route path="articles/:id" element={<ArticleDetailPage />} />
                  <Route path="articles/:id/edit" element={<EditArticlePage />} />
                  <Route path="articles/create" element={<CreateArticlePage />} />

                  <Route path="stories" element={<StoryPage />} />
                  <Route path="stories/:id/edit" element={<EditStoryPage />} />
                  <Route path="stories/create" element={<CreateStoryPage />} />

                  <Route path="aisupport" element={<AISupportPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="chat" element={<ChatPage />} />
                  <Route path="games" element={<AppGame />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ColorModeProvider>
        </Provider>
      </ReduxProvider>
    </SnackbarProvider>
  );
}

export default App;
