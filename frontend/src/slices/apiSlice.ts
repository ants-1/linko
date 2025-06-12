import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "https://linko-2hp9.onrender.com" });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Post"],
  endpoints: (_builder) => ({}),
});
