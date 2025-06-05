import { Box, Typography, Alert, Button, Avatar, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFetchUserQuery } from "../slices/userApiSlice";
import {
  useToggleFollowMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
} from "../slices/followApiSlice";
import EditProfileForm from "../components/EditProfileForm";
import FollowCard from "../components/FollowCard";
import { useState } from "react";

const FollowButton = ({
  isFollowing,
  onToggle,
  disabled,
}: {
  currentUserId: string;
  targetUserId: string;
  isFollowing: boolean;
  onToggle: () => void;
  disabled: boolean;
}) => {
  return (
    <Button
      size="small"
      variant="contained"
      onClick={onToggle}
      disabled={disabled}
      sx={{ mt: 1 }}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

const Profile = () => {
  const { id: userId } = useParams<{ id: string }>();
  const { userInfo } = useSelector((state: any) => state.auth);
  const currentUserId = userInfo?.user?._id || userInfo?.user?.userId;
  const isAuthor = currentUserId?.toString() === userId?.toString();

  const { data, isLoading, error } = useFetchUserQuery(userId);
  const [showEditForm, setShowEditForm] = useState(false);

  const { data: followersData, refetch: refetchFollowers } = useGetFollowersQuery(userId || "", { skip: !userId });
  const { data: followingData, refetch: refetchFollowing } = useGetFollowingQuery(userId || "", { skip: !userId });

  const [toggleFollow, { isLoading: followLoading }] = useToggleFollowMutation();

  const isFollowing = followersData?.followers?.some((f: any) => f._id === currentUserId);

  const toggleEditForm = () => setShowEditForm((prev) => !prev);

  const handleFollowToggle = async () => {
    try {
      await toggleFollow({ currentUserId, targetUserId: userId }).unwrap();
      refetchFollowers();
      refetchFollowing();
      window.location.reload();
    } catch (err) {
      console.error("Toggle follow failed", err);
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">Failed to load user info</Alert>;

  const user = data?.user;

  return (
    <Box sx={{ maxWidth: 600, width: "100%", mx: "auto", mt: 4, p: 3, pb: 6 }}>
      {/* Profile Header */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
        <Avatar
          alt={user?.username}
          src={user?.avatarUrl || ""}
          sx={{ width: 150, height: 150, fontSize: 40, mb: 1 }}
        >
          {!user?.avatarUrl && user?.username?.[0]}
        </Avatar>
        <Typography variant="h5">{user?.username || "-"}</Typography>

        {!isAuthor && currentUserId && (
          <FollowButton
            currentUserId={currentUserId}
            targetUserId={userId!}
            isFollowing={isFollowing}
            onToggle={handleFollowToggle}
            disabled={followLoading}
          />
        )}
      </Box>

      {/* Author Details */}
      {isAuthor && (
        <>
          <Typography variant="h6">Email</Typography>
          <Typography pl={1} mb={2}>{user?.email || "..."}</Typography>
        </>
      )}

      <Typography variant="h6">Description</Typography>
      <Typography pl={1} mb={2}>{user?.description || "..."}</Typography>

      {isAuthor && (
        <>
          <Divider sx={{ my: 2 }} />
          <Button variant="outlined" onClick={toggleEditForm} sx={{ mt: 2, mb: 2 }}>
            {showEditForm ? "Hide Edit Form" : "Edit Profile"}
          </Button>
          {showEditForm && <EditProfileForm userData={user} />}
        </>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Followers List */}
      <Typography variant="h6" mb={1}>Followers</Typography>
      {followersData?.followers?.length > 0 ? (
        followersData.followers.map((f: any) => (
          <FollowCard
            key={f._id}
            user={f}
            isFollowing={false}
            onToggle={refetchFollowers}
          />
        ))
      ) : (
        <Typography color="text.secondary">No followers yet.</Typography>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Following List */}
      <Typography variant="h6" mb={1}>Following</Typography>
      {followingData?.following?.length > 0 ? (
        followingData.following.map((f: any) => (
          <FollowCard
            key={f._id}
            user={f}
            isFollowing={true}
            onToggle={refetchFollowing}
          />
        ))
      ) : (
        <Typography color="text.secondary">Not following anyone yet.</Typography>
      )}
    </Box>
  );
};

export default Profile;
