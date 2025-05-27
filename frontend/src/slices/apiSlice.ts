import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "http://localhost:5001" });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Post"],
  endpoints: (builder) => ({}),
});
