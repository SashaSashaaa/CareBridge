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
  baseUrl: '/api/articles/',
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

export const articleApi = createApi({
  reducerPath: 'articleApi',

  baseQuery: baseQueryWithReauth,

  tagTypes: ['Article', 'MyArticle'],

  endpoints: (builder) => ({
    getArticles: builder.query({
      query: ({ page = 1, name = '' }) => {
        const params = new URLSearchParams()

        params.append('page', page)

        if (name) params.append('name', name)

        return `?${params.toString()}`
      },
      providesTags: [{ type: 'Article', id: 'LIST' }],
    }),

    getOneArticle: builder.query({
      query: (id) => `${id}/`,
      providesTags: (result, error, id) => [{ type: 'Article', id }],
    }),

    getMyArticles: builder.query({
      query: () => 'my/',
      providesTags: [{ type: 'MyArticle', id: 'LIST' }],
    }),

    createArticle: builder.mutation({
      query: (body) => ({
        url: 'create/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Article', id: 'LIST' },
        { type: 'MyArticle', id: 'LIST' },
      ],
    }),

    updateArticle: builder.mutation({
      query: ({ id, body }) => ({
        url: `${id}/update/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Article', id },
        { type: 'Article', id: 'LIST' },
        { type: 'MyArticle', id: 'LIST' },
      ],
    }),

    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `delete/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Article', id: 'LIST' },
        { type: 'MyArticle', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetArticlesQuery,
  useGetOneArticleQuery,
  useGetMyArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articleApi