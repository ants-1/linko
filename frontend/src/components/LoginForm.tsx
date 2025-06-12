import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/userApiSlice.js";
import { setCredentials } from "../slices/authSlice.js";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  Divider,
  Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { jwtDecode } from "jwt-decode";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      const decoded: any = jwtDecode(token);
      const user = {
        token,
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email,
      };
      dispatch(setCredentials(user));
      navigate("/");
    }
  }, [dispatch, navigate]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      navigate("/");
    } catch (err: any) {
      setError(err?.data?.error || "Invalid username or password");
    }
  }

  const handleGoogleLogin = async () => {
    window.location.href = "https://linko-2hp9.onrender.com/api/v1/auth/google";
  }

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
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            color="primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          />
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 3, p: 2, fontWeight: "bold" }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <Divider sx={{ mt: 3 }}>OR</Divider>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ mt: 3, p: 1.5 }}
            onClick={handleGoogleLogin}
          >
            Login with Google{" "}
            <GoogleIcon color="primary" sx={{ ml: 1, mb: 0.5 }} />
          </Button>
          <Typography sx={{ mt: 3, textAlign: "center" }}>
            Don't have an account? <Link to="/sign-up">Sign up!</Link>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}