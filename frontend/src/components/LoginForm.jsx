import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { Link } from "react-router";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username, "Password:", password);
  };

  return (
    <Container maxWidth="sm">
      <Card variant="outlined" sx={{ p: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          color="secondary"
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
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            color="secondary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            color="secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 12, p: 2, fontWeight: "bold" }}
            >
              Login
            </Button>
          </Link>
          <Divider sx={{ mt: 3 }} />
          <Link>
            <Button
              type="submit"
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mt: 3, p: 1.5 }}
            >
              Sign in with Google{" "}
              <GoogleIcon color="secondary" sx={{ ml: 1, mb: 0.5 }} />
            </Button>
          </Link>
          <Typography sx={{ mt: 3, textAlign: "center" }}>
            Don't have an account? <Link to="/sign-up">Sign up!</Link>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}
