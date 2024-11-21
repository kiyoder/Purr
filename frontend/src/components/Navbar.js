import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PurrLogo from "../assets/logo_colored.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  const isJoinUsActive =
    location.pathname === "/volunteer" || location.pathname === "/about-us";

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        padding: "8px",
        position: "relative",
        borderBottom: "60px solid",
        borderColor: "primary.main",
      }}
    >
      <Toolbar>
        {/* Left Section: Logo */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            paddingLeft: isSmallScreen ? "20px" : "200px",
          }}
        >
          <img
            src={PurrLogo}
            alt="Logo"
            style={{
              height: isSmallScreen ? "40px" : "60px",
              marginRight: "10px",
            }}
          />
          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            component="div"
            color="primary"
            sx={{ fontWeight: "bold", fontFamily: "'Caramel', sans-serif" }}
          >
            Purr
          </Typography>
        </Box>

        {/* Center Section: Navigation Links */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {["Home", "Adopt", "Donate", "Lost and Found"].map((text) => {
            const linkPath = `/${text.toLowerCase().replace(/\s/g, "-")}`;
            const isActive = location.pathname === linkPath;
            return (
              <Box
                key={text}
                component={Link}
                to={linkPath}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: isSmallScreen ? "5px 10px" : "10px 20px",
                  borderRadius: "20px",
                  backgroundColor: isActive ? "primary.main" : "white",
                  color: isActive ? "white" : "primary.main",
                  fontWeight: "bold",
                  fontSize: isSmallScreen ? "0.8rem" : "1rem",
                  textDecoration: "none",
                  "&:hover": {
                    backgroundColor: "lightgray",
                  },
                }}
              >
                {text}
              </Box>
            );
          })}
          <Box
            onClick={handleMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: isSmallScreen ? "5px 10px" : "10px 20px",
              borderRadius: "20px",
              backgroundColor: isJoinUsActive ? "primary.main" : "white",
              color: isJoinUsActive ? "white" : "primary.main",
              fontWeight: "bold",
              fontSize: isSmallScreen ? "0.8rem" : "1rem",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "lightgray",
              },
            }}
          >
            Join Us <ArrowDropDownIcon sx={{ marginLeft: "5px" }} />
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              component={Link}
              to="/volunteer"
              onClick={handleMenuClose}
              sx={{
                padding: "10px 20px",
                color: "primary.main",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "lightgray" },
              }}
            >
              Volunteer
            </MenuItem>
            <MenuItem
              component={Link}
              to="/about-us"
              onClick={handleMenuClose}
              sx={{
                padding: "10px 20px",
                color: "primary.main",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "lightgray" },
              }}
            >
              About Us
            </MenuItem>
          </Menu>
        </Box>

        {/* Right Section: Notifications and Login/Register */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            paddingRight: isSmallScreen ? "10px" : "100px",
            gap: "10px",
          }}
        >
          <IconButton
            color="primary"
            sx={{
              padding: isSmallScreen ? "5px" : "10px",
              backgroundColor: "white",
              color: "primary.main",
              cursor: "pointer",
              borderRadius: "50px",
              border: "2px solid",
              borderColor: "primary.main",
              "&:hover": { backgroundColor: "lightgray" },
            }}
          >
            <NotificationsIcon />
          </IconButton>
          <Box
            onClick={openAuthModal}
            component={Link}
            to="/login"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: isSmallScreen ? "5px 10px" : "10px 20px",
              backgroundColor: "white",
              color: "primary.main",
              cursor: "pointer",
              borderRadius: "50px",
              border: "2px solid",
              borderColor: "primary.main",
              fontSize: isSmallScreen ? "0.8rem" : "1rem",
              "&:hover": { backgroundColor: "lightgray" },
            }}
          >
            <AccountCircleIcon sx={{ marginRight: "5px" }} />
            Login | Register
          </Box>
        </Box>
        <AuthModal open={authModalOpen} handleClose={closeAuthModal} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
