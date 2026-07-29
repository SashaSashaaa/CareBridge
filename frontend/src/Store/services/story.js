import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

function getCSRF() {
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()

    if (cookie.startsWith('csrftoken=')) {
      return cookie.substring('csrftoken='.length)
    }
  }

  return null
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api/stories/',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const csrf = getCSRF()
    const token = localStorage.getItem('access')

    if (csrf) {
      headers.set('X-CSRFToken', csrf)
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    headers.set('Accept', 'application/json')

    return headers
  },
})

const refreshBaseQuery = fetchBaseQuery({
  baseUrl: '/api/',
  credentials: 'include',
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refresh = localStorage.getItem('refresh')

    if (refresh) {
      const refreshResult = await refreshBaseQuery(
        {
          url: 'token/refresh/',
          method: 'POST',
          body: { refresh },
        },
        api,
        extraOptions
      )

      if (refreshResult.data?.access) {
        localStorage.setItem('access', refreshResult.data.access)

        result = await rawBaseQuery(args, api, extraOptions)
      } else {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
      }
    } else {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
    }
  }

  return result
}

export const storyApi = createApi({
  reducerPath: 'storyApi',

  baseQuery: baseQueryWithReauth,

  tagTypes: ['Story', 'MyStory'],

  endpoints: (builder) => ({
    getStories: builder.query({
      query: (params) => ({
        url: '',
        params,
      }),
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map((item) => ({
                type: 'Story',
                id: item.id,
              })),
              { type: 'Story', id: 'LIST' },
            ]
          : [{ type: 'Story', id: 'LIST' }],
    }),

    getOneStory: builder.query({
      query: (id) => `${id}/`,
      providesTags: (result, error, id) => [{ type: 'Story', id }],
    }),

    getMyStories: builder.query({
      query: () => 'my/',
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: 'MyStory',
                id: item.id,
              })),
              { type: 'MyStory', id: 'LIST' },
            ]
          : [{ type: 'MyStory', id: 'LIST' }],
    }),

    createStory: builder.mutation({
      query: (body) => ({
        url: 'create/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Story', id: 'LIST' },
        { type: 'MyStory', id: 'LIST' },
      ],
    }),

    updateStory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `update/${id}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Story', id },
        { type: 'Story', id: 'LIST' },
        { type: 'MyStory', id },
        { type: 'MyStory', id: 'LIST' },
      ],
    }),

    deleteStory: builder.mutation({
      query: (id) => ({
        url: `delete/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Story', id },
        { type: 'Story', id: 'LIST' },
        { type: 'MyStory', id },
        { type: 'MyStory', id: 'LIST' },
      ],
    }),
    likeStory: builder.mutation({
      query: (id) => ({
        url: `${id}/like/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Story', id },
      ],
    }),
  }),
})

export const {
  useGetStoriesQuery,
  useGetOneStoryQuery,
  useGetMyStoriesQuery,
  useCreateStoryMutation,
  useUpdateStoryMutation,
  useDeleteStoryMutation,
  useLikeStoryMutation, 
} = storyApi