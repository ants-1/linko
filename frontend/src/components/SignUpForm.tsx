import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSignUpMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  Alert,
  Divider,
} from "@mui/material";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState<any>({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signUp, { isLoading }] = useSignUpMutation();
  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const newErrors: any = {};
    if (!username.trim()) newErrors.username = "*Username is required";
    if (!email.trim()) newErrors.email = "*Email is required";
    if (!password.trim()) newErrors.password = "*Password is required";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "*Confirm Password is required";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "*Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    try {
      const res = await signUp({ username, email, password }).unwrap();
      dispatch(setCredentials(res));
      navigate("/");
    } catch (err: any) {
      setError(err?.data?.message || "Sign up failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Card variant="outlined" sx={{ p: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          color="primary"
          sx={{
            fontWeight: "bold",
            my: 2,
            fontSize: "2rem",
            textAlign: "center",
          }}
        >
          Sign Up
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            color="primary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!fieldErrors.username}
            helperText={fieldErrors.username}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            color="primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            color="primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            color="primary"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!fieldErrors.confirmPassword}
            helperText={fieldErrors.confirmPassword}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 3, p: 1.5, fontWeight: "bold" }}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>

          <Divider sx={{ mt: 3 }}></Divider>

          <Typography sx={{ mt: 3, textAlign: "center" }}>
            Already have an account? <Link to="/login">Login!</Link>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}
