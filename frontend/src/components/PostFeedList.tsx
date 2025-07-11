import { useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/joy";
import { Pagination } from "@mui/material";
import PostCard from "./PostCard";
import { useFetchFeedPostsQuery } from "../slices/postApiSlice";
import { useSelector } from "react-redux";

export default function PostFeedList({ searchQuery }: { searchQuery: string }) {
  const [page, setPage] = useState(1);
  const limit = 6;
  const { userInfo } = useSelector((state: any) => state.auth);
  const userId = userInfo?.user?._id || userInfo?.user?.userId;
  const token = userInfo?.token;

  const { data, isLoading, error } = useFetchFeedPostsQuery({ page, limit, userId, token, search: searchQuery });

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="danger">Failed to load posts.</Typography>;

  return (
    <Box display="flex" flexDirection="column"
      width="100%"
      alignItems="center" gap={3} p={2}>
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="center"
        width="100%"
        maxWidth="900px"
      >
        {data?.posts?.map((post: any) => (
          <PostCard key={post._id} post={post} />
        ))}
      </Box>

      <Pagination
        count={data.totalPages}
        page={page}
        onChange={handlePageChange}
        variant="outlined"
        color="primary"
      />
    </Box>
  );
}
