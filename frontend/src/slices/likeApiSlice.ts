import { apiSlice } from "./apiSlice";

const LIKE_URL = "/api/v1/likes";

export const likeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchLikeCount: builder.query<{ postId: string; likeCount: number }, string>({
      query: (postId) => ({
        url: `${LIKE_URL}/${postId}`,
        method: "GET",
      }),
    }),

    toggleLike: builder.mutation<{ message: string }, { userId: string; postId: string }>({
      query: ({ userId, postId }) => ({
        url: LIKE_URL,
        method: "POST",
        body: { userId, postId },
      }),
    }),
  }),
});

export const { useFetchLikeCountQuery, useToggleLikeMutation } = likeApiSlice;
