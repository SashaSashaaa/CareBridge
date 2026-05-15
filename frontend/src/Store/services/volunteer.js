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
  baseUrl: '/api/volunteers/',
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

export const volunteerApi = createApi({
  reducerPath: 'volunteerApi',

  baseQuery: baseQueryWithReauth,

  tagTypes: ['Volunteer', 'Category', 'MyVolunteer'],

  endpoints: (builder) => ({
    getVolunteers: builder.query({
      query: ({ page = 1, name = '', category = '' }) => {
        const params = new URLSearchParams()

        params.append('page', page)

        if (name) params.append('name', name)
        if (category) params.append('category', category)

        return `?${params.toString()}`
      },
      providesTags: [{ type: 'Volunteer', id: 'LIST' }],
    }),

    getCategories: builder.query({
      query: () => 'categories/',
      providesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    getOneVolunteer: builder.query({
      query: (id) => `${id}/`,
      providesTags: (result, error, id) => [{ type: 'Volunteer', id }],
    }),

    getMyVolunteers: builder.query({
      query: () => 'my/',
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: 'MyVolunteer',
                id: item.id,
              })),
              { type: 'MyVolunteer', id: 'LIST' },
            ]
          : [{ type: 'MyVolunteer', id: 'LIST' }],
    }),

    createVolunteer: builder.mutation({
      query: (body) => ({
        url: 'create/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Volunteer', id: 'LIST' },
        { type: 'MyVolunteer', id: 'LIST' },
      ],
    }),

    updateVolunteer: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${id}/update/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Volunteer', id },
        { type: 'Volunteer', id: 'LIST' },
        { type: 'MyVolunteer', id },
        { type: 'MyVolunteer', id: 'LIST' },
      ],
    }),

    deleteVolunteer: builder.mutation({
      query: (id) => ({
        url: `delete/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Volunteer', id },
        { type: 'Volunteer', id: 'LIST' },
        { type: 'MyVolunteer', id },
        { type: 'MyVolunteer', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetVolunteersQuery,
  useGetCategoriesQuery,
  useGetOneVolunteerQuery,
  useGetMyVolunteersQuery,
  useCreateVolunteerMutation,
  useUpdateVolunteerMutation,
  useDeleteVolunteerMutation,
} = volunteerApi