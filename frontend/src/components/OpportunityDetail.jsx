import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Grid,
    Paper,
    Button,
    TextField,
    Snackbar,
    Stack,
    IconButton,
    InputAdornment,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import { motion } from 'framer-motion';
import petImg from '../images/example.jpg';

const OpportunityDetail = () => {
    const { id } = useParams();
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        address: '',
        phoneNumber: '',
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [openDialog, setOpenDialog] = useState(false); // State for confirmation dialog
    const navigate = useNavigate();

    const fetchOpportunityDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/volunteer/opportunity/${id}`);
            setOpportunity(response.data);
        } catch (error) {
            console.error('Error fetching opportunity details:', error);
            setError('Could not fetch opportunity details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunityDetail();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpenDialog(true); // Show confirmation dialog on submit
    };

    const handleConfirmSubmit = async () => {
        const dataToSubmit = {
            ...formData,
            opportunityId: id,
            hoursWorked: opportunity.hoursWorked,
        };

        try {
            await axios.post(`http://localhost:8080/api/volunteer/signup/${id}`, dataToSubmit);
            setSuccessMessage('Successfully signed up for the opportunity!');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/volunteer');
            }, 2000);
        } catch (error) {
            console.error('Error registering for the event', error);
        } finally {
            setOpenDialog(false); // Close dialog after submission
        }
    };

    const handleCancelSubmit = () => {
        setOpenDialog(false); // Close the dialog without submitting
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>{error}</Typography>;
    }

    if (!opportunity) {
        return <Typography>No opportunity found.</Typography>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <Grid container spacing={3} sx={{ paddingTop: 5, paddingX: 10 }}>
                <Grid item xs={12}>
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outlined"
                        color="secondary"
                        sx={{ marginBottom: 2 }}
                    >
                        Back
                    </Button>
                </Grid>

                {/* Opportunity Details */}
                <Grid item xs={12} md={7} sx={{ marginTop: 3 }}>
                    <Paper elevation={0} sx={{ padding: 3, borderRadius: 2 }}>
                        <Typography variant="h4" gutterBottom color='purple'>
                            {opportunity.title}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {opportunity.description}
                        </Typography>
                        <Box sx={{ marginTop: 3, height: 'auto' }}>
                            <img src={petImg} alt="Opportunity" style={{ width: '100%', height: '600px', borderRadius: 8 }} />
                        </Box>
                        <Box sx={{ marginTop: 3, padding: 2, borderRadius: 2, border: '1px solid lightgray' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                <LocationOnIcon sx={{ marginRight: 1, color: '#9B4D96' }} />
                                <Typography variant="body2" sx={{ color: '#9B4D96' }}><strong>Location:</strong> {opportunity.location}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                <EventIcon sx={{ marginRight: 1, color: '#9B4D96' }} />
                                <Typography variant="body2" sx={{ color: '#9B4D96' }}><strong>Date:</strong> {opportunity.date}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                <AccessTimeIcon sx={{ marginRight: 1, color: '#9B4D96' }} />
                                <Typography variant="body2" sx={{ color: '#9B4D96' }}><strong>Hours:</strong> {opportunity.hoursWorked}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <GroupIcon sx={{ marginRight: 1, color: '#9B4D96' }} />
                                <Typography variant="body2" sx={{ color: '#9B4D96' }}><strong>Volunteers Needed:</strong> {opportunity.volunteersNeeded}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Sign-Up Form */}
                <Grid item xs={12} md={5} sx={{ marginTop: 18 }}>
                    <Paper elevation={1} sx={{ padding: 3, borderRadius: '16px', backgroundColor: '#fbfbfb' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <LocationOnIcon sx={{ color: '#9B4D96', marginRight: 1 }} />
                            <Typography variant="h6" gutterBottom>Sign Up for Opportunity</Typography>
                        </Box>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <TextField name="firstName" label="First Name" onChange={handleChange} fullWidth required />
                                <TextField name="lastName" label="Last Name" onChange={handleChange} fullWidth required />
                                <TextField name="email" label="Email" type="email" onChange={handleChange} fullWidth required />
                                <TextField
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleClickShowPassword} edge="end">
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField name="address" label="Address" onChange={handleChange} fullWidth required />
                                <TextField name="phoneNumber" label="Phone Number" onChange={handleChange} fullWidth required />
                            </Stack>

                            <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{
                                    paddingX: 4,
                                    paddingY: 1.5,
                                    backgroundColor: '#9B4D96',
                                    borderRadius: '8px',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#7A3B7B', // Darker purple on hover
                                    },
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>

                        </form>
                    </Paper>
                </Grid>

                {/* Snackbar for Success Message */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    message={successMessage}
                />

                {/* Confirmation Dialog */}
                <Dialog open={openDialog} onClose={handleCancelSubmit}>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogContent>
                        <Typography>Do you want to sign up for this opportunity?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelSubmit} color="secondary">No</Button>
                        <Button onClick={handleConfirmSubmit} color="primary">Yes</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </motion.div>
    );
};

export default OpportunityDetail;
