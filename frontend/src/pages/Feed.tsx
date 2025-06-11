import { useState } from "react";
import { Box, Typography } from "@mui/material";
import PostFeedList from "../components/PostFeedList";
import SearchBar from "../components/SearchBar";

export default function Feed() {
  const [query, setQuery] = useState("");

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
      <Typography variant="h3" fontWeight="semibold" sx={{ mb: 2}}>Feed</Typography>
      <SearchBar onSearch={(q) => setQuery(q)} />
      <PostFeedList searchQuery={query} />
    </Box>
  )
}