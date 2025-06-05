import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
} from "../slices/userApiSlice";
import { useSelector } from "react-redux";

export default function EditProfileForm({ userData }: { userData: any }) {
  const { userInfo } = useSelector((state: any) => state.auth);
  const userId = userInfo?.user?._id || userInfo?.user?.userId;
  const token = userInfo?.token;

  const [updateUser] = useUpdateUserMutation();
  const [updatePassword] = useUpdateUserPasswordMutation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    description: "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        description: userData.description || "",
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      await updateUser({ userId, updates: formData, token }).unwrap();
      setSuccessMsg("Profile updated successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setPasswordError("");
      await updatePassword({
        userId,
        oldPassword,
        newPassword,
        token,
      }).unwrap();

      setOldPassword("");
      setNewPassword("");
      setSuccessMsg("Password updated successfully.");
    } catch (err: any) {
      const errorMessage =
        err?.data?.error || err?.data?.message || "Password update failed.";
      setPasswordError(errorMessage);
    }
  };

  return (
    <Box my={4}>
      <Typography variant="h5" gutterBottom>
        Edit Profile
      </Typography>

      {successMsg && (
        <Alert severity="success" onClose={() => setSuccessMsg("")}>
          {successMsg}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={3}
      />

      <Button
        variant="contained"
        onClick={handleUpdateProfile}
        sx={{ mt: 2 }}
      >
        Save Changes
      </Button>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>

      <TextField
        fullWidth
        label="Old Password"
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        margin="normal"
        error={!!passwordError}
      />
      <TextField
        fullWidth
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        margin="normal"
        error={!!passwordError}
        helperText={passwordError}
      />

      <Button
        variant="outlined"
        onClick={handleUpdatePassword}
        sx={{ mt: 1 }}
      >
        Update Password
      </Button>
    </Box>
  );
}
