import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router";

export default function SignUpForm() {
  const [username, setUsername] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const handleSubmit = (e) => {
    e.precentDefault();
    console.log(
      "Username:",
      username,
      "Name:",
      name,
      "Email:",
      email,
      "Password:",
      password,
      "Confirm Password",
      confirmPassword
    );
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
          Sign Up
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
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            color="secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            color="secondary"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            color="secondary"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Link>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 10, p: 1.5, fontWeight: "bold" }}
            >
              Sign Up
            </Button>
          </Link>
          <Typography sx={{ mt: 3, textAlign: "center" }}>
            Already have an account? <Link to="/">Login!</Link>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}
