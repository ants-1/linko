import { Container } from "@mui/material";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <LoginForm />
    </Container>
  );
}
