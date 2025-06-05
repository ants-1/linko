import { Box, Typography, Alert, Button, Avatar } from "@mui/material";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFetchUserQuery } from "../slices/userApiSlice";
import EditProfileForm from "../components/EditProfileForm";
import { useState } from "react";

const Profile = () => {
  const { id: userId } = useParams<{ id: string }>();
  const { userInfo } = useSelector((state: any) => state.auth);
  const authorId = userInfo?.user?._id || userInfo?.user?.userId;
  const isAuthor = authorId?.toString() === userId?.toString();

  const { data, isLoading, error } = useFetchUserQuery(userId);
  const [showEditForm, setShowEditForm] = useState(false);

  const toggleEditForm = () => setShowEditForm((prev) => !prev);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">Failed to load user info</Alert>;

  const user = data?.user;

  return (
    <Box sx={{ maxWidth: 600, width: "100%", mx: "auto", mt: 4, p: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mb: 1 }}>
        <Avatar
          alt={user?.username}
          src={user?.avatarUrl || ""}
          sx={{ width: 150, height: 150, fontSize: 40, mb: 1 }}
        >
          {!user?.avatar && user?.username?.[0]}
        </Avatar>
        <Typography mb={2}>{user?.username || "-"}</Typography>
      </Box>

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
          <Button
            variant="outlined"
            onClick={toggleEditForm}
            sx={{ mt: 2, mb: 2 }}
          >
            {showEditForm ? "Hide Edit Form" : "Edit Profile"}
          </Button>

          {showEditForm && <EditProfileForm userData={user} />}
        </>
      )}
    </Box>
  );
};

export default Profile;
