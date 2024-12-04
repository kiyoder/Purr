import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
    Container,
    Box,
    Typography,
    Button,
    TextField,
    Avatar,
    Grid,
    Stack,
    InputAdornment,
    IconButton,
    Tooltip,
} from "@mui/material";
import { useUser } from "./UserContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Profile = () => {
    const { user, updateUser, loading } = useUser();
    const [editingUserId, setEditingUserId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        address: "",
        phoneNumber: "",
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [passwordChange, setPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setEditFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                address: user.address,
                phoneNumber: user.phoneNumber,
            });
            setProfilePicture(user.profilePicture);
        }
    }, [user]);

    const handleEdit = () => setEditingUserId(user?.userId);

    const handleCancelEdit = () => {
        setEditingUserId(null);
    };

    const handleEditChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
        }
    };

    const handleAvatarClick = () => {
        if (editingUserId) {
            fileInputRef.current.click();
        }
    };

    const handleSaveEdit = async () => {
        setIsSaving(true);
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token is missing. Please log in again.");
            return;
        }
        const formData = new FormData();
        formData.append("user", JSON.stringify(editFormData));
        if (profilePicture) {
            formData.append("profilePicture", profilePicture);
        }
        try {
            const response = await axios.put(
                `http://localhost:8080/api/users/${user.userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 200) {
                const updatedResponse = await axios.get(
                    `http://localhost:8080/api/users/me`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (updatedResponse.status === 200) {
                    updateUser(updatedResponse.data);
                    setProfilePicture(updatedResponse.data.profilePicture);
                    setEditingUserId(null);
                }
            } else {
                console.error("Failed to update user");
            }
        } catch (error) {
            console.error("Error saving user:", error);
        }

        setIsSaving(false);
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token is missing. Please log in again.");
            return;
        }
        try {
            const response = await axios.post(
                `http://localhost:8080/api/users/change-password`,
                passwordData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                alert("Password changed successfully!");
                setPasswordChange(false);
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                console.error("Failed to change password");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            alert("An error occurred while changing the password.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found. Please log in again.</div>;
    }

    return (
        <Container>
            <Box sx={{ mt: 5, maxWidth: 500, mx: "auto" }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Profile
                </Typography>
                <Typography variant="subtitle1" align="center" gutterBottom>
                    Manage your account
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                        bgcolor: "background.paper",
                    }}
                >
                    <Tooltip
                        title={
                            editingUserId
                                ? "Click to upload a new profile picture"
                                : "Profile picture upload is disabled"
                        }
                    >
                        <Avatar
                            src={
                                profilePicture instanceof File || profilePicture instanceof Blob
                                    ? URL.createObjectURL(profilePicture)
                                    : user.profilePicture
                                        ? `data:image/jpeg;base64,${user.profilePicture}`
                                        : null
                            }
                            alt="Profile Picture"
                            sx={{
                                width: 125,
                                height: 125,
                                bgcolor: "grey.300",
                                mb: 2,
                                fontSize: "48px",
                                cursor: editingUserId ? "pointer" : "default",
                            }}
                            onClick={handleAvatarClick}
                        >
                            {(!profilePicture && !user.profilePicture) &&
                                (user.firstName ? user.firstName[0] : "")}
                        </Avatar>
                    </Tooltip>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    <Stack spacing={2} sx={{ width: "100%" }}>
                        <Grid container spacing={0}>
                            <Grid
                                item
                                xs={6}
                                sx={{ pl: 0, pr: 2, pt: 2 }}
                            >
                                <TextField
                                    name="firstName"
                                    label="First Name"
                                    value={editingUserId ? editFormData.firstName : user.firstName}
                                    onChange={editingUserId ? handleEditChange : null}
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        readOnly: !editingUserId,
                                    }}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                sx={{ pl: 0, pr: 0, pt: 2 }}
                            >
                                <TextField
                                    name="lastName"
                                    label="Last Name"
                                    value={editingUserId ? editFormData.lastName : user.lastName}
                                    onChange={editingUserId ? handleEditChange : null}
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        readOnly: !editingUserId,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            name="username"
                            label="Username"
                            value={editingUserId ? editFormData.username : user.username}
                            onChange={editingUserId ? handleEditChange : null}
                            variant="outlined"
                            fullWidth
                            size="small"
                            InputProps={{
                                readOnly: !editingUserId,
                            }}
                        />
                        <TextField
                            name="email"
                            label="Email"
                            value={editingUserId ? editFormData.email : user.email}
                            onChange={editingUserId ? handleEditChange : null}
                            variant="outlined"
                            fullWidth
                            size="small"
                            InputProps={{
                                readOnly: !editingUserId,
                            }}
                        />
                        <TextField
                            name="address"
                            label="Address"
                            value={editingUserId ? editFormData.address : user.address}
                            onChange={editingUserId ? handleEditChange : null}
                            variant="outlined"
                            fullWidth
                            size="small"
                            InputProps={{
                                readOnly: !editingUserId,
                            }}
                        />
                        <TextField
                            name="phoneNumber"
                            label="Phone Number"
                            value={editingUserId ? editFormData.phoneNumber : user.phoneNumber}
                            onChange={editingUserId ? handleEditChange : null}
                            variant="outlined"
                            fullWidth
                            size="small"
                            InputProps={{
                                readOnly: !editingUserId,
                            }}
                        />
                    </Stack>
                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                        {editingUserId ? (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveEdit}
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleEdit}
                                >
                                    Edit Profile
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => setPasswordChange(!passwordChange)}
                                >
                                    Change Password
                                </Button>
                            </>
                        )}
                    </Box>
                    {passwordChange && (
                        <Box sx={{ mt: 3, width: "100%" }}>
                            <TextField
                                label="Old Password"
                                name="oldPassword"
                                type={showOldPassword ? "text" : "password"}
                                value={passwordData.oldPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        oldPassword: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                            >
                                                {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="New Password"
                                name="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Confirm New Password"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlePasswordChange}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setPasswordChange(false)}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default Profile;
