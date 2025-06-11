import { apiSlice } from "./apiSlice";
const CHAT_URL = "/api/v1/chats";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchChats: builder.query({
      query: () => ({
        url: `${CHAT_URL}`,
        method: "GET",
      }),
    }),
    fetchUserChats: builder.query({
      query: ({ userId, token }: { userId: string; token: string }) => ({
        url: `${CHAT_URL}/users/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    fetchChat: builder.query({
      query: (chatId: string) => ({
        url: `${CHAT_URL}/${chatId}`,
        method: "GET",
      }),
    }),
    createChat: builder.mutation({
      query: ({ formData, token }: { formData: FormData; token: string }) => ({
        url: `${CHAT_URL}`,
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    editChat: builder.mutation({
      query: ({
        formData,
        chatId,
        token,
      }: {
        formData: FormData;
        chatId: string;
        token: string;
      }) => ({
        url: `${CHAT_URL}/${chatId}`,
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteChat: builder.mutation({
      query: ({
        chatId,
        hostId,
        token,
      }: {
        chatId: string;
        hostId: string;
        token: string;
      }) => ({
        url: `${CHAT_URL}/${chatId}`,
        method: "DELETE",
        body: { hostId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    joinChat: builder.mutation({
      query: ({
        userId,
        chatId,
        token,
      }: {
        userId: string;
        chatId: string;
        token: string;
      }) => ({
        url: `${CHAT_URL}/${chatId}/join`,
        method: "PUT",
        body: { userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    leaveChat: builder.mutation({
      query: ({
        userId,
        chatId,
        token,
      }: {
        userId: string;
        chatId: string;
        token: string;
      }) => ({
        url: `${CHAT_URL}/${chatId}/leave`,
        method: "PUT",
        body: { userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useFetchChatsQuery,
  useFetchUserChatsQuery,
  useFetchChatQuery,
  useCreateChatMutation,
  useEditChatMutation,
  useDeleteChatMutation,
  useJoinChatMutation,
  useLeaveChatMutation,
} = chatApiSlice;
