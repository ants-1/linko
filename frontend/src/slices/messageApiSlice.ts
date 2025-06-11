import { apiSlice } from "./apiSlice";
const MESSAGE_URL = "/api/v1/chats";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchMessages: builder.query({
      query: (chatId: string) => ({
        url: `${MESSAGE_URL}/${chatId}/messages`,
        method: "GET",
      }),
    }),
    fetchMessage: builder.query({
      query: ({
        chatId,
        messageId,
      }: {
        chatId: string;
        messageId: string;
      }) => ({
        url: `${MESSAGE_URL}/${chatId}/messages/${messageId}`,
        method: "GET",
      }),
    }),
    createMessage: builder.mutation({
      query: ({
        sender,
        content,
        chatId,
        token,
      }: {
        sender: string;
        content: string;
        chatId: string;
        token: string;
      }) => ({
        url: `${MESSAGE_URL}/${chatId}/messages`,
        method: "POST",
        body: { sender, content },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    editMessage: builder.mutation({
      query: ({
        formData,
        chatId,
        messageId,
        token,
      }: {
        formData: FormData;
        chatId: string;
        messageId: string;
        token: string;
      }) => ({
        url: `${MESSAGE_URL}/${chatId}/messages/${messageId}`,
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteMessage: builder.mutation({
      query: ({
        formData,
        chatId,
        messageId,
        token,
      }: {
        formData: FormData;
        chatId: string;
        messageId: string;
        token: string;
      }) => ({
        url: `${MESSAGE_URL}/${chatId}/messages/${messageId}`,
        method: "DELETE",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useFetchMessagesQuery,
  useFetchMessageQuery,
  useCreateMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
} = messageApiSlice;
