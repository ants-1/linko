import { Box } from "@mui/material";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh"
    }}>
      <Navbar />
      <Outlet />
      <Footer />
    </Box>
  );
};

export default MainLayout;