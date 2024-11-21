import React from "react";
import {
  Box,
  Typography,
  Link,
  TextField,
  Button,
  Toolbar,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ backgroundColor: "primary.main", color: "#fff" }}
    >
      {/* Upper Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          color: "#2F3E46",
          padding: "40px 20px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "start",
          flexWrap: "wrap",
          mt: 10,
        }}
      >
        {/* Left Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            How Can We Help?
          </Typography>
          {["Donate", "Adopt a Pet", "Adopt FAQ's", "Rehome FAQ's"].map(
            (item) => (
              <Link
                key={item}
                href="#"
                underline="none"
                sx={{
                  display: "block",
                  color: "#2F3E46",
                  fontSize: "14px",
                  marginBottom: "8px",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {item}
              </Link>
            )
          )}
        </Box>

        {/* Center Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOnIcon sx={{ marginRight: "8px" }} />
            San Fernando, Cebu
          </Typography>
          <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PhoneIcon sx={{ marginRight: "8px" }} />
            +1 (555) 123-4567
          </Typography>
          <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <EmailIcon sx={{ marginRight: "8px" }} />
            PurrSupport@gmail.com
          </Typography>
        </Box>

        {/* Right Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Keep In Touch With Us
          </Typography>
          <Typography
            sx={{ fontSize: "14px", marginBottom: "8px", color: "#2F3E46" }}
          >
            Join the Purr magazine and be first to hear about news
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              placeholder="E-mail Address"
              size="small"
              sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                input: { padding: "8px" },
              }}
            />
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                borderColor: "#6A4EB6",
                color: "#6A4EB6",
                "&:hover": {
                  backgroundColor: "#6A4EB6",
                  color: "#fff",
                },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Lower Section */}
      <Toolbar
        sx={{
          backgroundColor: "primary.main",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
        }}
      >
        {/* Copyright */}
        <Typography
          variant="body2"
          sx={{ fontSize: "14px", color: "#fff", textAlign: "left" }}
        >
          ©2024 PURR.com
        </Typography>

        {/* Social Media Icons */}
        <Box>
          <IconButton sx={{ color: "#fff" }}>
            <FacebookIcon />
          </IconButton>
          <IconButton sx={{ color: "#fff" }}>
            <TwitterIcon />
          </IconButton>
          <IconButton sx={{ color: "#fff" }}>
            <InstagramIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </Box>
  );
};

export default Footer;
