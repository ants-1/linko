import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useFetchChatQuery,
} from "../slices/chatApiSlice";
import {
  useFetchMessagesQuery,
  useCreateMessageMutation,
} from "../slices/messageApiSlice";
import socket from "../utils/socket";
import { receiveMessage } from "../slices/socketSlice";
import MessageCard from "../components/MessageCard";

export default function ChatMessagingPage() {
  const { id } = useParams<{ id: string }>();
  const chatId = id;
  const { userInfo } = useSelector((state: any) => state.auth);
  const token = userInfo?.token;
  const userId = userInfo?.user.userId || userInfo?.user._id;
  const dispatch = useDispatch();

  // Fetch chat info
  const {
    data: chat,
    isLoading: chatLoading,
    isError: chatError,
  } = useFetchChatQuery(chatId || "");

  // Fetch messages
  const {
    data: messages = [],
    isLoading: messagesLoading,
    isError: messagesError,
    refetch: refetchMessages,
  } = useFetchMessagesQuery(chatId || "");
  const countries = chat?.countries;
  const socketMessages = useSelector((state: any) => state.socket.messages[chatId!] || []);

  const seen = new Set();
  const allMessages = [...messages, ...socketMessages].filter((msg) => {
    if (seen.has(msg._id)) return false;
    seen.add(msg._id);
    return true;
  });


  useEffect(() => {
    if (!chatId) return;

    socket.emit("join room", chatId);

    const handleIncomingMessage = () => {
      socket.on("chat message", (message) => {
        dispatch(receiveMessage({ chatId, message }));
      });
    };

    return () => {
      socket.emit("leave room", chatId);
      socket.off("chat message", handleIncomingMessage);
    };
  }, [chatId, dispatch]);


  const [createMessage, { isLoading: sending }] = useCreateMessageMutation();

  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const isUserInChat = chat?.users?.some(
    (user: { _id: string }) => user._id === userId
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const formData = new FormData();
    formData.append("content", newMessage.trim());

    try {
      await createMessage({
        sender: userId,
        content: newMessage.trim(),
        chatId: chatId!,
        token,
      }).unwrap();

      setNewMessage("");
      refetchMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (chatLoading || messagesLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (chatError) {
    return (
      <Typography variant="h6" color="error" align="center" mt={4}>
        Failed to load chat info.
      </Typography>
    );
  }

  if (messagesError) {
    return (
      <Typography variant="h6" color="error" align="center" mt={4}>
        Failed to load messages.
      </Typography>
    );
  }

  if (!chat) {
    return (
      <Typography variant="h6" color="error" align="center" mt={4}>
        Chat not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, width: "100%", mx: "auto", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mb: 2,
          borderBottom: "1px solid #ccc",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {chat.imgUrl ? (
            <Avatar src={chat.imgUrl} sx={{ width: 48, height: 48, mr: 2 }} />
          ) : (
            <Avatar sx={{ width: 48, height: 48, mr: 2 }}>
              {chat.name.charAt(0).toUpperCase()}
            </Avatar>
          )}

          <Typography variant="h5" component="h1">
            {chat.name}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          {countries.map((country: any, index: any) => (
            <Chip
              key={country}
              label={country}
              variant="outlined"
              color={index === 1 ? "secondary" : "primary"}
              size="small"
            />
          ))}
        </Box>
      </Box>

      <Paper
        sx={{
          height: "55vh",
          overflowY: "auto",
          mb: 2,
          p: 2,
          bgcolor: "#fafafa",
          borderRadius: 2,
          boxShadow: 1,
        }}
        role="log"
        aria-live="polite"
      >
        {allMessages?.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No messages yet. Say hello!
          </Typography>
        ) : (
          allMessages.map((msg: any) => {
            return (
              <MessageCard key={msg._id} message={msg} />
            )
          })
        )}
        <div ref={messagesEndRef} />
      </Paper>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        sx={{ display: "flex", gap: 1 }}
      >
        <TextField
          label="Type your message"
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending || !isUserInChat}
          autoComplete="off"
        />
        <Button
          variant="contained"
          type="submit"
          disabled={sending || newMessage.trim() === "" || !isUserInChat}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
