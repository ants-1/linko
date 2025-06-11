import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Message {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
    imgUrl?: string;
  };
  createdAt: string;
  chatId: string;
}

interface SocketState {
  messages: {
    [chatId: string]: Message[];
  };
}

const initialState: SocketState = {
  messages: {},
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    receiveMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: Message }>
    ) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
    resetSocketMessages: (state) => {
      state.messages = {};
    },
  },
});

export const { receiveMessage, resetSocketMessages } = socketSlice.actions;
export default socketSlice.reducer;
