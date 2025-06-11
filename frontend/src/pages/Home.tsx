import { Box, Typography, Button, Container, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function Home() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: any) => state.auth);
  const userId = userInfo?.user?.userId || userInfo?.user?._id;

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 10,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h2" align="center" gutterBottom>
              Welcome to Linko
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary">
              Share your travel experiences, connect with fellow explorers, and chat about your favorite destinations across the globe.
            </Typography>
          </motion.div>

          <Grid container spacing={2} justifyContent="center" mt={3}>
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {!userId && (
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  sx={{ mr: 2 }}
                  onClick={() => navigate("/sign-up")}
                >
                  Get Started
                </Button>
              )}
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                sx={{ mr: 2 }}
                onClick={() => navigate("/chat")}
              >
                Explore Chats
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ mr: 2 }}
                onClick={() => navigate("/blog")}
              >
                Explore Blogs
              </Button>
            </motion.div>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mt: 8,
          py: 4,
          mb: 10,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 8 }} align="center" gutterBottom>
            Why Linko?
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              mt: 3,
              flexWrap: "nowrap",
              alignItems: "flex-start",
            }}
          >
            {[
              {
                title: "Travel Blogs",
                desc: "Post stories and experiences from your trips, complete with images and country tags.",
              },
              {
                title: "Global Chat",
                desc: "Engage in real-time conversations about destinations, tips, and plans.",
              },
              {
                title: "Community Driven",
                desc: "Follow fellow travelers, like posts, and stay inspired for your next journey.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.3 }}
                viewport={{ once: true }}
                style={{ flex: "1 1 0", maxWidth: 300 }}
              >
                <Paper
                  variant="outlined"
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 200,
                  }}
                >
                  <Typography variant="h6" color={i % 2 == 0 ? "primary" : "secondary"} sx={{ mb: 2 }} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ flexGrow: 1 }}>
                    {feature.desc}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

    </Box>
  );
}
