import { Container } from "@mui/material";
import SignUpForm from "../components/SignUpForm";

export default function SignUp() {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <SignUpForm />
    </Container>
  );
}
