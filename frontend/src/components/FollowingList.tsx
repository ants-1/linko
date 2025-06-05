import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useGetFollowingQuery } from "../slices/followApiSlice";
import FollowCard from "./FollowCard";

interface FollowingListProps {
  userId: string;
}

export default function FollowingList({ userId }: FollowingListProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFollowingQuery(userId);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error: {(error as any)?.data?.error || "Could not fetch following"}</Alert>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Following
      </Typography>
      {data?.following?.length ? (
        data.following.map((user: any) => (
          <FollowCard
            key={user._id}
            user={user}
            isFollowing={true}
            onToggle={refetch}
          />
        ))
      ) : (
        <Typography>Not following anyone yet.</Typography>
      )}
    </Box>
  );
}
