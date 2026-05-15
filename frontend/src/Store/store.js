import { configureStore } from "@reduxjs/toolkit";
import { volunteerApi } from "./services/volunteer";
import { userApi } from "./services/user";
import { profileApi } from "./services/profile";
import { aisupportApi } from "./services/aisupport";
import { articleApi } from "./services/article";
import { storyApi } from "./services/story";
import { advertisementApi } from "./services/advertisement";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [volunteerApi.reducerPath]: volunteerApi.reducer,
    [articleApi.reducerPath]: articleApi.reducer,
    [storyApi.reducerPath]: storyApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [aisupportApi.reducerPath]: aisupportApi.reducer,
    [advertisementApi.reducerPath]: advertisementApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      volunteerApi.middleware,
      articleApi.middleware,
      storyApi.middleware,
      profileApi.middleware,
      aisupportApi.middleware,
      advertisementApi.middleware,
    ),
});
