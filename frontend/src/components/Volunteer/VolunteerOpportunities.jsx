import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import VolunteerSignUpList from './VolunteerSignUpList';

const VolunteerOpportunities = () => {
    const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
    const [open, setOpen] = useState(false); // Dialog state for Add/Edit
    const [selectedOpportunity, setSelectedOpportunity] = useState(null); // Selected opportunity for edit
    const [openSignUpList, setOpenSignUpList] = useState(false); // Dialog state for Sign-Up List
    const [signUpList, setSignUpList] = useState([]); // Filtered sign-ups for selected opportunity

    const API_BASE_URL = 'http://localhost:8080/api/volunteer'; // Base URL for API

    // Fetch all opportunities
    const fetchVolunteerOpportunities = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/opportunities`);
            setVolunteerOpportunities(data);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
        }
    };

    // Fetch individual opportunity by ID
const fetchOpportunityById = async (id) => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/opportunity/${id}`);
        setSelectedOpportunity(data); // Set the opportunity details for editing or viewing
    } catch (error) {
        console.error('Error fetching opportunity by ID:', error);
    }
};

    // Fetch sign-ups for a specific opportunity
    const fetchSignUpsForOpportunity = async (opportunityId) => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/signup`);
            const filteredSignUps = data.filter((signup) => signup.opportunityId === opportunityId);
            setSignUpList(filteredSignUps);
            setOpenSignUpList(true);
        } catch (error) {
            console.error('Error fetching sign-ups:', error);
        }
    };

    useEffect(() => {
        fetchVolunteerOpportunities();
    }, []);

    // Open Add/Edit Dialog and fetch individual opportunity if editing
const handleOpenDialog = (opportunity = null) => {
    if (opportunity?.opportunityId) {
        fetchOpportunityById(opportunity.opportunityId); // Fetch individual opportunity if editing
    } else {
        setSelectedOpportunity({ title: '', description: '', date: '', location: '', hoursWorked: 0, volunteersNeeded: 0 });
    }
    setOpen(true);
};

    // Close Add/Edit Dialog
    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedOpportunity(null);
    };

    // Save/Add Opportunity
    const handleSave = async () => {
        const isEdit = !!selectedOpportunity?.opportunityId;
        const url = isEdit
            ? `${API_BASE_URL}/opportunity/${selectedOpportunity.opportunityId}`
            : `${API_BASE_URL}/opportunity`;

        const method = isEdit ? axios.put : axios.post;

        try {
            await method(url, selectedOpportunity);
            fetchVolunteerOpportunities();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving opportunity:', error);
        }
    };

    // Delete Opportunity
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this opportunity?')) {
            try {
                await axios.delete(`${API_BASE_URL}/opportunity/${id}`);
                fetchVolunteerOpportunities();
            } catch (error) {
                console.error('Error deleting opportunity:', error);
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Volunteer Opportunities Admin Dashboard
            </Typography>

            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                Add Volunteer Opportunity
            </Button>

            <Grid container spacing={3} style={{ marginTop: 20 }}>
                {volunteerOpportunities.length > 0 ? (
                    volunteerOpportunities.map((opportunity) => (
                        <Grid item xs={12} sm={6} md={4} key={opportunity.opportunityId}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">{opportunity.title}</Typography>
                                    <Typography variant="body2">ID: {opportunity.opportunityId}</Typography>
                                    <Typography variant="body2">{opportunity.description}</Typography>
                                    <Typography variant="body2">Date: {new Date(opportunity.date).toLocaleDateString()}</Typography>
                                    <Typography variant="body2">Location: {opportunity.location}</Typography>
                                    <Typography variant="body2">Hours: {opportunity.hoursWorked || 'Not specified'}</Typography>
                                    <Typography variant="body2">Volunteers Needed: {opportunity.volunteersNeeded || 'Not specified'}</Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton onClick={() => handleOpenDialog(opportunity)}>
                                        <Edit sx={{ color: '#1976d2' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(opportunity.opportunityId)}>
                                        <Delete sx={{ color: '#f44336' }} />
                                    </IconButton>
                                    <Button onClick={() => fetchSignUpsForOpportunity(opportunity.opportunityId)}>
                                        View Sign-ups
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" style={{ marginTop: 20 }}>
                        No volunteer opportunities available.
                    </Typography>
                )}
            </Grid>

            {/* Sign-Up List Dialog */}
            <Dialog open={openSignUpList} onClose={() => setOpenSignUpList(false)}>
                <DialogTitle>Sign-ups for {selectedOpportunity?.title}</DialogTitle>
                <DialogContent>
                    <VolunteerSignUpList signUps={signUpList} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSignUpList(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add/Edit Opportunity Dialog */}
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>{selectedOpportunity?.opportunityId ? 'Edit Opportunity' : 'Add Opportunity'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="normal"
                        value={selectedOpportunity?.title}
                        onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, title: e.target.value })}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        value={selectedOpportunity?.description}
                        onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, description: e.target.value })}
                    />
                    <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={selectedOpportunity?.date}
                        onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, date: e.target.value })}
                    />
                    <TextField
                        label="Location"
                        fullWidth
                        margin="normal"
                        value={selectedOpportunity?.location}
                        onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, location: e.target.value })}
                    />
                    <TextField
                        label="Volunteers Needed"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={selectedOpportunity?.volunteersNeeded}
                        onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, volunteersNeeded: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VolunteerOpportunities;
