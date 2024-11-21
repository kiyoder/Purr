import axios from 'axios';
import React, { useState } from 'react';
import { Typography, TextField, Button, Snackbar, Stack, Paper, Box, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import icons for show/hide functionality

const VolunteerSignUp = ({ opportunityID, hoursWorked, onClose }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        address: '',
        phoneNumber: ''
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State for password visibility

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const dataToSubmit = {
            ...formData,
            opportunityId: opportunityID,
            hoursWorked: hoursWorked
        };

        try {
            const response = await axios.post(`http://localhost:8080/api/volunteer/signup/${opportunityID}`, dataToSubmit);
            console.log(response.data);
            setSuccessMessage('Successfully signed up for the opportunity!');
            setSnackbarOpen(true);
            onClose();
        } catch (error) {
            console.error('Error registering for the event', error);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword); // Toggle password visibility
    };

    return (
        <Paper elevation={3} sx={{ padding: 3 }}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        name="firstName"
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                        fullWidth
                    />
                    <TextField
                        name="lastName"
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                        fullWidth
                    />
                    <TextField
                        name="email"
                        type="email"
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        fullWidth
                    />
                    <TextField
                        name="password"
                        type={showPassword ? 'text' : 'password'} // Show password when showPassword is true
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />} {/* Corrected icons */}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        name="address"
                        onChange={handleChange}
                        placeholder="Address"
                        required
                        fullWidth
                    />
                    <TextField
                        name="phoneNumber"
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                        fullWidth
                    />
                    <Box display="flex" justifyContent="space-between">
                        <Button type="submit" variant="contained" color="primary" sx={{ width: '100%' }}>
                            Sign Up
                        </Button>
                    </Box>
                </Stack>
            </form>

            {/* Snackbar for success message */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={successMessage}
            />
        </Paper>
    );
};

export default VolunteerSignUp;
