import { useState } from "react";
import { Box, Typography } from "@mui/material";
import PostList from "../components/PostList";
import SearchBar from "../components/SearchBar";

export default function Blog() {
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
      <Typography variant="h3" fontWeight="semibold" sx={{ mb: 2 }}>Blogs</Typography>
      <SearchBar onSearch={(q) => setQuery(q)} />
      <PostList searchQuery={query} />
    </Box>
  )
}