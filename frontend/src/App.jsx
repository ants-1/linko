import { Routes, Route } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { keyframes } from "@emotion/react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(-90deg, #6a11cb,#aa25fc, #6a11cb, #1b1b3a)",
        backgroundSize: "400% 400%",
        animation: `${gradientAnimation} 8s ease infinite`,
      }}
    >
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </Box>
  );
}

export default App;