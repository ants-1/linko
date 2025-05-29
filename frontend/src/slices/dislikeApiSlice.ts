import { apiSlice } from "./apiSlice";

const DISLIKE_URL = "/api/v1/dislikes";

export const dislikeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchDislikeCount: builder.query<{ postId: string; dislikeCount: number }, string>({
      query: (postId) => ({
        url: `${DISLIKE_URL}/${postId}`,
        method: "GET",
      }),
    }),

    toggleDislike: builder.mutation<{ message: string }, { userId: string; postId: string }>({
      query: ({ userId, postId }) => ({
        url: DISLIKE_URL,
        method: "POST",
        body: { userId, postId },
      }),
    }),
  }),
});

export const { useFetchDislikeCountQuery, useToggleDislikeMutation } = dislikeApiSlice;
