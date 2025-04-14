// Footer.jsx
import React from "react";
import { Box, Typography, Link, Container } from "@mui/material";

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
      }}
    >
      <Container maxWidth="md">
        <Typography variant="body2" color="text.secondary" align="center">
          {"Built by "}
          <Link
            color="inherit"
            href="https://github.com/HninThida"
            target="_blank"
            rel="noopener"
          >
            Hnin Thida
          </Link>{" "}
          using React, MUI, Prisma, and PostgreSQL.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} SnapPost. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
