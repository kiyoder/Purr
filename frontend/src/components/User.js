import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Avatar,
    Typography,
    Container,
    CircularProgress,
    Button,
} from "@mui/material";
import axios from "axios";

const User = () => {
    const { id } = useParams(); // Get userId from the URL
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${id}`);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [id]);

    const handleRedirectToProfile = () => {
        navigate("/profile"); // Redirect to Profile.js for logged-in user
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Typography color="error">User not found!</Typography>;
    }

    const loggedInUserId = parseInt(localStorage.getItem("userId"), 10);

    return (
        <Container sx={{ mt: 5 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    bgcolor: "background.paper",
                }}
            >
                <Avatar
                    src={user.profilePicture}
                    alt={user.firstName}
                    sx={{
                        width: 120,
                        height: 120,
                        bgcolor: "grey.300",
                        fontSize: "48px",
                        mb: 2,
                    }}
                >
                    {!user.profilePicture && user.firstName[0]}
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                    {user.firstName} {user.lastName}
                </Typography>
                <Typography color="textSecondary">{user.email}</Typography>
                <Typography color="textSecondary">{user.address}</Typography>

                {loggedInUserId === user.userId && (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        onClick={handleRedirectToProfile}
                    >
                        Edit Your Profile
                    </Button>
                )}
            </Box>
        </Container>
    );
};

export default User;
