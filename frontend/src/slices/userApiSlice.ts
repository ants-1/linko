import { apiSlice } from "./apiSlice.js";
const AUTH_URL = "/api/v1/auth";
const USER_URL = "/api/v1/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "GET",
      }),
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/sign-up`,
        method: "POST",
        body: data,
      }),
    }),
    fetchUsers: builder.query({
      query: () => ({
        url: `${USER_URL}`,
        method: "GET",
      }),
    }),
    fetchUser: builder.query({
      query: (userId: string | undefined) => ({
        url: `${USER_URL}/${userId}`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: ({
        userId,
        updates,
        token,
      }: {
        userId: string | undefined;
        updates: any;
        token: string;
      }) => ({
        url: `${USER_URL}/${userId}`,
        method: "PUT",
        body: { userId, updates },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    updateUserPassword: builder.mutation({
      query: ({
        userId,
        oldPassword,
        newPassword,
        token,
      }: {
        userId: string | undefined;
        oldPassword: string;
        newPassword: string;
        token: string;
      }) => ({
        url: `${USER_URL}/${userId}/password`,
        method: "PUT",
        body: { userId, oldPassword, newPassword},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useSignUpMutation,
  useFetchUsersQuery,
  useFetchUserQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
} = userApiSlice;
