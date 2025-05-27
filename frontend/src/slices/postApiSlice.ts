import { apiSlice } from "./apiSlice";
const POST_URL = "/api/v1/posts";

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchPosts: builder.query({
      query: ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => ({
        url: `${POST_URL}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),

    fetchFeedPosts: builder.query({
      query: ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => ({
        url: `${POST_URL}/feeds?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),

    createPost: builder.mutation({
      query: (data: any) => ({
        url: `${POST_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    editPost: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `${POST_URL}/${id}`,
        method: "PUT",
        body: data,
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
  useCreatePostMutation,
  useEditPostMutation,
  useDeletePostMutation,
} = postApiSlice;
