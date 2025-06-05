import { Avatar, Box, Button, Typography, Paper } from "@mui/material";
import { useToggleFollowMutation } from "../slices/followApiSlice";
import { useSelector } from "react-redux";

interface FollowCardProps {
  user: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  isFollowing: boolean;
  onToggle?: () => void;
}

export default function FollowCard({ user, isFollowing, onToggle }: FollowCardProps) {
  const { userInfo } = useSelector((state: any) => state.auth);
  const currentUserId = userInfo?.user?._id || userInfo?.user?.userId;

  const [toggleFollow, { isLoading }] = useToggleFollowMutation();

  const handleFollowToggle = async () => {
    try {
      await toggleFollow({
        currentUserId,
        targetUserId: user._id,
      }).unwrap();

      if (onToggle) onToggle(); 
    } catch (err) {
      console.error("Toggle follow error:", err);
    }
  };

  return (
    <Paper elevation={2} variant="outlined" sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
      <Avatar
        src={user.avatarUrl || "/default-avatar.png"}
        alt={user.username}
        sx={{ width: 50, height: 50 }}
      >
        {user.username?.charAt(0).toUpperCase() || "U"}
      </Avatar>

      <Box flex={1}>
        <Typography variant="subtitle1">{user.username}</Typography>
      </Box>

      <Button
        variant={isFollowing ? "outlined" : "contained"}
        color={isFollowing ? "secondary" : "primary"}
        onClick={handleFollowToggle}
        disabled={isLoading}
        size="small"
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </Paper>
  );
}
