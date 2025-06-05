import { Box, Container, Typography, Link, Stack } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light" ? "#f5f5f5" : "#1c1c1c",
        borderTop: "1px solid #ccc",
      }}
    >
      <Container maxWidth="md">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" color="textSecondary" align="center">
            © {new Date().getFullYear()} Linko. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="/about" color="inherit" underline="hover">
              About
            </Link>
            <Link href="/contact" color="inherit" underline="hover">
              Contact
            </Link>
            <Link href="/privacy" color="inherit" underline="hover">
              Privacy
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
