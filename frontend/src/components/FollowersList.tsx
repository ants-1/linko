import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useGetFollowersQuery } from "../slices/followApiSlice";
import FollowCard from "./FollowCard";

interface FollowersListProps {
  userId: string;
}

export default function FollowersList({ userId }: FollowersListProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFollowersQuery(userId);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error: {(error as any)?.data?.error || "Could not fetch followers"}</Alert>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Followers
      </Typography>
      {data?.followers?.length ? (
        data.followers.map((user: any) => (
          <FollowCard
            key={user._id}
            user={user}
            isFollowing={false}
            onToggle={refetch}
          />
        ))
      ) : (
        <Typography>No followers yet.</Typography>
      )}
    </Box>
  );
}
