import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api/",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access")

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
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

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: baseQueryWithReauth,

  tagTypes: ["User"],

  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "user/profile/",
      providesTags: ["User"],
    }),

    login: builder.mutation({
      query: (body) => ({
        url: "token/",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const { data } = await queryFulfilled

        localStorage.setItem("access", data.access)
        localStorage.setItem("refresh", data.refresh)
      },
      invalidatesTags: ["User"],
    }),

    signup: builder.mutation({
      query: (body) => ({
        url: "user/register/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation({
      queryFn: async () => {
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        return { data: null }
      },
      invalidatesTags: ["User"],
    }),
  }),
})

export const {
  useGetUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
} = userApi