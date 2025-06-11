import { Box } from "@mui/material";
import PostList from "../components/PostList";
import SearchBar from "../components/SearchBar";

export default function Blog() {
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
      <SearchBar onSearch={(query) => console.log("Searching for:", query)} />
      <PostList />
    </Box>
  )
}