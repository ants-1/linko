import {
  Box,
  Tab,
  Tabs,
  Typography,
  Button,
} from "@mui/material";
import { useState, type SyntheticEvent } from "react";
import { useSelector } from "react-redux";
import ChatList from "../components/ChatList";
import { useFetchChatsQuery, useFetchUserChatsQuery } from "../slices/chatApiSlice";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const navigate = useNavigate();

  const [value, setValue] = useState("one");

  const { userInfo } = useSelector((state: any) => state.auth);
  const token = userInfo?.token;
  const userId = userInfo?.user.userId || userInfo?.user?._id;

  const { data: chats, error, refetch, isLoading } = useFetchChatsQuery(undefined);
  const { data: myChats, refetch: myRefetch } = useFetchUserChatsQuery({ userId, token });

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: 600, width: "100%", mx: "auto", mt: 2, p: 3, pb: 6 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab value="one" label="All" />
        <Tab value="two" label="My Chats" disabled={!userInfo} />
      </Tabs>
      {userInfo && (
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/chat/create")}>
          Create Chat
        </Button>
      )}

      <Box sx={{ mt: 3 }}>
        {isLoading && <Typography>Loading chats...</Typography>}
        {error && <Typography color="error">Failed to load chats</Typography>}
        {!isLoading && !error && (
          <>
            {value === "one" && <ChatList chats={chats || []} onRefresh={refetch} />}
            {value === "two" &&
              (userInfo ? (
                <ChatList chats={myChats || []} onRefresh={myRefetch} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Please log in to see your chats.
                </Typography>
              ))}
          </>
        )}
      </Box>
    </Box>
  );
}
