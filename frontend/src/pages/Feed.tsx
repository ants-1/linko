import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PostFeedList from "../components/PostFeedList";
import SearchBar from "../components/SearchBar";

export default function Feed() {
  const [query, setQuery] = useState("");
  const { userInfo } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        marginTop: "40px",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" sx={{ mb: 2 }}>Feed</Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Box sx={{ height: 40 }}>
          <SearchBar onSearch={(q) => setQuery(q)} />
        </Box>
        {userInfo && (
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2, height: 40 }}
            onClick={() => navigate("/post/create")}
          >
            Create Post
          </Button>
        )}
      </Box>
      <PostFeedList searchQuery={query} />
    </Box>
  )
}