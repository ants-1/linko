import { useState, type MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/userApiSlice";
import { logout } from "../slices/authSlice";
import { useSelector } from "react-redux";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: any) => state.auth);
  const avatarUrl = userInfo?.user?.avatarUrl || "/default-avatar.png";
  const username = userInfo?.user?.username || "User";
  console.log(userInfo);

  const pages = [
    { name: "Home", path: "/home" },
    { name: "Feed", path: "/feed" },
    { name: "Blog", path: "/blog" },
    { name: "Chats", path: "/chat" },
  ];
  const settings = [
    { name: "Profile", path: "/profile" },
    { name: "Logout", path: "/" },
  ];

  const [logoutApi] = useLogoutMutation();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    try {
      await logoutApi(undefined);
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleOpenNavMenu = (e: MouseEvent<HTMLElement>) => {
    setAnchorElNav(e.currentTarget);
  };

  const handleOpenUserMenu = (e: MouseEvent<HTMLElement>) => {
    setAnchorElUser(e.currentTarget);
  };

  const handleCloseNavMenu = (path?: string) => {
    setAnchorElNav(null);
    if (path) navigate(path);
  };

  const handleCloseUserMenu = (setting: string) => {
    setAnchorElUser(null);
    if (setting === "Logout") {
      handleLogout();
    } else {
      navigate("/profile");
    }
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            src="/linko-logo.png"
            alt="Linko's logo"
            sx={{ height: 60, display: { xs: "none", md: "flex" }, mr: 1 }}
          />

          {/* Mobile Menu Icon */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu()}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages
                .filter(page => !["Chats", "Feed"].includes(page.name) || userInfo)
                .map((page) => (
                  <MenuItem
                    key={page.name}
                    onClick={() => handleCloseNavMenu(page.path)}
                  >
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
            </Menu>
          </Box>

          {/* Logo on small screens */}
          <Box
            component="img"
            src="/linko-logo.png"
            alt="Linko's logo"
            sx={{ height: 60, display: { xs: "flex", md: "none" }, mr: 1 }}
          />

          {/* App Name */}
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Linko
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages
              .filter(page => !["Chats", "Feed"].includes(page.name) || userInfo)
              .map((page) => (
                <Button
                  key={page.name}
                  onClick={() => handleCloseNavMenu(page.path)}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name}
                </Button>
              ))}
          </Box>

          {/* User Settings */}
          <Box sx={{ flexGrow: 0 }}>
            {userInfo ? (
              // Logged-in user: show avatar and settings
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={username} src={avatarUrl} />
                  </IconButton>
                </Tooltip>

                <Menu
                  sx={{ mt: "45px" }}
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={() => handleCloseUserMenu("")}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.name}
                      onClick={() => handleCloseUserMenu(setting.name)}
                    >
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              // Not logged in: show Login and Sign Up buttons
              <>
                <Button color="inherit" onClick={() => navigate("/sign-up")}>
                  Sign Up
                </Button>
                <Button color="inherit" onClick={() => navigate("/")}>
                  Login
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
