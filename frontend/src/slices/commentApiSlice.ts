import { apiSlice } from "./apiSlice";
const COMMENT_URL = "/api/v1";

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchPostComments: builder.query({
      query: ({ postId }: { postId: string }) => ({
        url: `${COMMENT_URL}/post/${postId}/comments`,
        method: "GET",
      }),
    }),

    addComment: builder.mutation({
      query: ({
        postId,
        userId,
        content,
        token,
      }: {
        postId: string;
        userId: string;
        content: string;
        token: string;
      }) => ({
        url: `${COMMENT_URL}/posts/${postId}/comments`,
        method: "POST",
        body: { postId, userId, content },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    deleteComment: builder.mutation({
      query: ({
        postId,
        commentId,
        token,
        userId,
      }: {
        postId: string;
        commentId: string;
        token: string;
        userId: string;
      }) => ({
        url: `${COMMENT_URL}/posts/${postId}/comments/${commentId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { userId },
      }),
    }),
  }),
});

export const {
  useFetchPostCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} = commentApiSlice;
