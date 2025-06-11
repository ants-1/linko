import {
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";

interface MessageCardProps {
  message: any;
}

export default function MessageCard({ message }: MessageCardProps) {
  const { userInfo } = useSelector((state: any) => state.auth);
  const userId = userInfo?.user.userId || userInfo?.user?._id;
  const isOwnMessage = message.sender._id === userId;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isOwnMessage ? "flex-end" : "flex-start",
        mb: 1,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isOwnMessage ? "row-reverse" : "row",
          alignItems: "flex-end",
          gap: 1,
          maxWidth: "80%",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar
            src={message.sender.avatarUrl}
            sx={{ width: 32, height: 32 }}
            alt={message.sender.username}
          >
            {!message.sender.avatarUrl &&
              message.sender.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="caption"
            sx={{
              color: "#888",
              textAlign: isOwnMessage ? "right" : "left",
              display: "block",
              mb: 0.5,
            }}
          >
            {message.sender.username}
          </Typography>
        </Box>
        <Box>
          <Box
            sx={{
              bgcolor: isOwnMessage ? "#1976d2" : "#e0e0e0",
              color: isOwnMessage ? "#fff" : "#000",
              borderRadius: 2,
              textAlign: isOwnMessage ? "right" : "left",
              p: 1,
              wordBreak: "break-word",
            }}
          >
            <Typography variant="body2">{message.content}</Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 0.5, opacity: 0.7 }}
            >
              {new Date(message.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
