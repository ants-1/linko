import { apiSlice } from "./apiSlice";

const FOLLOW_URL = "/api/v1";

export const followApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Toggle follow/unfollow
    toggleFollow: builder.mutation({
      query: ({ currentUserId, targetUserId }) => ({
        url: `${FOLLOW_URL}/follows/toggle`,
        method: "PUT",
        body: { currentUserId, targetUserId },
      }),
    }),

    // Get followers of a user
    getFollowers: builder.query({
      query: (userId: string) => `${FOLLOW_URL}/users/${userId}/followers`,
    }),

    // Get followings of a user
    getFollowing: builder.query({
      query: (userId: string) => `${FOLLOW_URL}/users/${userId}/followings`,
    }),
  }),
});

export const {
  useToggleFollowMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
} = followApiSlice;
