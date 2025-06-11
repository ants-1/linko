import { apiSlice } from "./apiSlice";
const POST_URL = "/api/v1/posts";

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchPosts: builder.query({
      query: ({ page = 1, limit = 10, search = "" }: { page?: number; limit?: number, search: string }) => ({
        url: `${POST_URL}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        method: "GET",
      }),
    }),

    fetchFeedPosts: builder.query({
      query: ({
        page = 1,
        limit = 10,
        userId,
        token,
        search = "",
      }: {
        page?: number;
        limit?: number;
        userId: string;
        token: string;
        search: string;
      }) => ({
        url: `${POST_URL}/users/${userId}/feeds?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    fetchPost: builder.query({
      query: ({ id }: { id: string }) => ({
        url: `${POST_URL}/${id}`,
        method: "GET",
      }),
    }),

    increaseViewCount: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `${POST_URL}/${id}/views`,
        method: "GET",
      }),
    }),

    createPost: builder.mutation({
      query: ({ formData, token }: { formData: FormData; token: string }) => ({
        url: POST_URL,
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    editPost: builder.mutation({
      query: ({
        id,
        formData,
        token,
      }: {
        id: string;
        formData: any;
        token: string;
      }) => ({
        url: `${POST_URL}/${id}`,
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    deletePost: builder.mutation({
      query: (id: string) => ({
        url: `${POST_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchPostsQuery,
  useFetchFeedPostsQuery,
  useFetchPostQuery,
  useCreatePostMutation,
  useEditPostMutation,
  useDeletePostMutation,
  useIncreaseViewCountMutation,
} = postApiSlice;
