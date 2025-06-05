import { Box } from "@mui/material";
import SearchBar from "../components/SearchBar";
import PostFeedList from "../components/PostFeedList";

export default function Feed() {
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
      <PostFeedList />
    </Box>
  )
}