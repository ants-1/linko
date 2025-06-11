import { useState, type MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/userApiSlice";
import { logout } from "../slices/authSlice";

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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: any) => state.auth);
  const avatarUrl = userInfo?.user?.avatarUrl || "/default-avatar.png";
  const username = userInfo?.user?.username || "User";
  const userId = userInfo?.user?._id || userInfo?.user?.userId;

  const pages = [
    { name: "Home", path: "/home" },
    { name: "Feed", path: "/feed" },
    { name: "Blog", path: "/blog" },
    { name: "Chats", path: "/chat" },
  ];
  const settings = [
    { name: "Profile", path: `/profile/${userId}` },
    { name: "Logout", path: "/" },
  ];

  const [logoutApi] = useLogoutMutation();

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // User menu state
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

  // Drawer open/close handlers
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  // User menu handlers
  const handleOpenUserMenu = (e: MouseEvent<HTMLElement>) => {
    setAnchorElUser(e.currentTarget);
  };
  const handleCloseUserMenu = (settingName: string) => {
    setAnchorElUser(null);
    const selected = settings.find((s) => s.name === settingName);
    if (!selected) return;

    if (selected.name === "Logout") {
      handleLogout();
    } else {
      navigate(selected.path);
    }
  };

  // Navigate then close drawer
  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - desktop */}
          <Box
            component="img"
            src="/linko-logo.png"
            alt="Linko's logo"
            sx={{ height: 60, display: { xs: "none", md: "flex" }, mr: 1 }}
          />

          {/* Hamburger menu - only on xs */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={toggleDrawer(true)}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              ModalProps={{ keepMounted: true }}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {pages
                    .filter(
                      (page) =>
                        !["Feed"].includes(page.name) || userInfo
                    )
                    .map((page) => (
                      <ListItem key={page.name} disablePadding>
                        <ListItemButton
                          onClick={() => handleNavigate(page.path)}
                        >
                          <ListItemText primary={page.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>

                <Divider />

                {userInfo ? (
                  <List>
                    {settings.map((setting) => (
                      <ListItem key={setting.name} disablePadding>
                        <ListItemButton
                          onClick={() => {
                            if (setting.name === "Logout") {
                              setDrawerOpen(false);
                              handleLogout();
                            } else {
                              handleNavigate(setting.path);
                            }
                          }}
                        >
                          <ListItemText primary={setting.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <List>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          setDrawerOpen(false);
                          navigate("/sign-up");
                        }}
                      >
                        <ListItemText primary="Sign Up" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          setDrawerOpen(false);
                          navigate("/");
                        }}
                      >
                        <ListItemText primary="Login" />
                      </ListItemButton>
                    </ListItem>
                  </List>
                )}
              </Box>
            </Drawer>
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

          {/* Desktop menu buttons */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages
              .filter((page) => !["Feed"].includes(page.name) || userInfo)
              .map((page) => (
                <Button
                  key={page.name}
                  onClick={() => navigate(page.path)}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name}
                </Button>
              ))}
          </Box>

          {/* User settings */}
          <Box sx={{ flexGrow: 0 }}>
            {userInfo ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={username}
                      src={avatarUrl}
                      sx={{ backgroundColor: "white", color: "black" }}
                    />
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
