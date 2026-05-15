import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api/volunteers/",
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

const refreshBaseQuery = fetchBaseQuery({
  baseUrl: "/api/",
  credentials: "include",
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refresh = localStorage.getItem("refresh")

    if (refresh) {
      const refreshResult = await refreshBaseQuery(
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
    }
  }

  return result
}

export const advertisementApi = createApi({
  reducerPath: "advertisementApi",

  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    getAdvertisements: builder.query({
      query: () => "advertisements/",
    }),
  }),
})

export const { useGetAdvertisementsQuery } = advertisementApi