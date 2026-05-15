import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

function getCSRF() {
  const cookies = document.cookie.split(";")

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()

    if (cookie.startsWith("csrftoken=")) {
      return cookie.substring("csrftoken=".length)
    }
  }

  return null
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api/",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access")
    const csrf = getCSRF()

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    if (csrf) {
      headers.set("X-CSRFToken", csrf)
    }

    headers.set("Accept", "application/json")

    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refresh = localStorage.getItem("refresh")

    if (refresh) {
      const refreshResult = await rawBaseQuery(
        {
          url: "token/refresh/",
          method: "POST",
          body: { refresh },
        },
        api,
        extraOptions
      )

      if (refreshResult.data?.access) {
        localStorage.setItem("access", refreshResult.data.access)
        result = await rawBaseQuery(args, api, extraOptions)
      } else {
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
      }
    } else {
      localStorage.removeItem("access")
      localStorage.removeItem("refresh")
    }
  }

  return result
}

export const profileApi = createApi({
  reducerPath: "profileApi",

  baseQuery: baseQueryWithReauth,

  tagTypes: ["Profile", "MyVolunteers", "MyArticles", "MyStories"],

  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => "profile/me/",
      providesTags: ["Profile"],
    }),

    getMyVolunteers: builder.query({
      query: () => "volunteers/my/",
      providesTags: ["MyVolunteers"],
    }),

    createVolunteer: builder.mutation({
      query: (body) => ({
        url: "volunteers/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MyVolunteers"],
    }),

    updateVolunteer: builder.mutation({
      query: ({ id, body }) => ({
        url: `volunteers/${id}/update/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MyVolunteers"],
    }),

    deleteVolunteer: builder.mutation({
      query: (id) => ({
        url: `volunteers/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyVolunteers"],
    }),

    getMyArticles: builder.query({
      query: () => "articles/my/",
      providesTags: ["MyArticles"],
    }),

    createArticle: builder.mutation({
      query: (body) => ({
        url: "articles/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MyArticles"],
    }),

    updateArticle: builder.mutation({
      query: ({ id, body }) => ({
        url: `articles/${id}/update/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MyArticles"],
    }),

    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `articles/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyArticles"],
    }),

    getMyStories: builder.query({
      query: () => "stories/my/",
      providesTags: ["MyStories"],
    }),

    createStory: builder.mutation({
      query: (body) => ({
        url: "stories/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MyStories"],
    }),

    updateStory: builder.mutation({
      query: ({ id, body }) => ({
        url: `stories/${id}/update/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MyStories"],
    }),

    deleteStory: builder.mutation({
      query: (id) => ({
        url: `stories/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyStories"],
    }),
  }),
})

export const {
  useGetMyProfileQuery,
  useGetMyVolunteersQuery,
  useCreateVolunteerMutation,
  useUpdateVolunteerMutation,
  useDeleteVolunteerMutation,
  useGetMyArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useGetMyStoriesQuery,
  useCreateStoryMutation,
  useUpdateStoryMutation,
  useDeleteStoryMutation,
} = profileApi