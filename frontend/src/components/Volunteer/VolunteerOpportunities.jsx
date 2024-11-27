import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Container, Typography, Grid, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const VolunteerOpportunities = () => {
    const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedOpportunity, setSelectedOpportunity] = useState({ title: '', description: '', date: '', location: '', hoursWorked: 0, volunteersNeeded: 0, id: null });

    useEffect(() => {
        fetchVolunteerOpportunities();
    }, []);

    const fetchVolunteerOpportunities = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/volunteer/opportunities');
            setVolunteerOpportunities(response.data);
        } catch (error) {
            console.error("Error fetching volunteer opportunities:", error);
        }
    };

    const handleOpen = (opportunity = { title: '', description: '', date: '', location: '', hoursWorked: 0, volunteersNeeded: 0, id: null }) => {
        setSelectedOpportunity(opportunity);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedOpportunity({ title: '', description: '', date: '', location: '', hoursWorked: 0, volunteersNeeded: 0, id: null });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedOpportunity((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const confirmationMessage = selectedOpportunity.id 
            ? "Are you sure you want to update this opportunity?" 
            : "Are you sure you want to add this opportunity?";

        const confirmSave = window.confirm(confirmationMessage);

        if (confirmSave) {
            try {
                if (selectedOpportunity.id) {
                    await axios.put(`http://localhost:8080/api/volunteer/opportunity/${selectedOpportunity.id}`, selectedOpportunity);
                } else {
                    await axios.post('http://localhost:8080/api/volunteer/opportunity', selectedOpportunity);
                }
                fetchVolunteerOpportunities();
                handleClose();
            } catch (error) {
                console.error("Error saving opportunity:", error);
            }
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this opportunity?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8080/api/volunteer/opportunity/${id}`);
                fetchVolunteerOpportunities();
            } catch (error) {
                console.error("Error deleting opportunity:", error);
            }
        }
    };

    // Get today's date in the format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    return (
        <Container maxWidth="lg">
            <br />
            <Typography variant="h4" gutterBottom>
                Volunteer Opportunities Admin Dashboard
            </Typography>
            <Button variant="contained" sx={{ backgroundColor: '#4CAF50', color: 'white' }} onClick={() => handleOpen()}>
                Add Volunteer Opportunity
            </Button>
            <Grid container spacing={3} style={{ marginTop: '20px' }}>
                {volunteerOpportunities.map((opportunity) => (
                    <Grid item xs={12} sm={6} md={4} key={opportunity.opportunityID}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h5">{opportunity.title}</Typography>
                                <Typography variant="body2">Opportunity ID: {opportunity.opportunityID}</Typography>
                                <Typography variant="body2">{opportunity.description}</Typography>
                                <Typography variant="body2">
                                    {opportunity.date ? new Date(opportunity.date).toLocaleDateString() : "No date provided"}
                                </Typography>
                                <Typography variant="body2">{opportunity.location}</Typography>
                                <Typography variant="body2">
                                    Hours Worked: {opportunity.hoursWorked !== undefined ? opportunity.hoursWorked : "Not specified"}
                                </Typography>
                                <Typography variant="body2">
                                    Volunteers Needed: {opportunity.volunteersNeeded !== undefined ? opportunity.volunteersNeeded : "Not specified"}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton onClick={() => handleOpen(opportunity)}>
                                    <Edit sx={{ color: '#1976d2' }} />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(opportunity.opportunityID)}>
                                    <Delete sx={{ color: '#f44336' }} />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{selectedOpportunity.id ? 'Edit Volunteer Opportunity' : 'Add Volunteer Opportunity'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        name="title"
                        fullWidth
                        variant="outlined"
                        value={selectedOpportunity.title}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        fullWidth
                        variant="outlined"
                        value={selectedOpportunity.description}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        name="date"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={selectedOpportunity.date ? selectedOpportunity.date.split('T')[0] : ''}
                        onChange={handleChange}
                        inputProps={{ min: today }} // Disable past dates
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        name="location"
                        fullWidth
                        variant="outlined"
                        value={selectedOpportunity.location}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Hours Worked"
                        name="hoursWorked"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={selectedOpportunity.hoursWorked}
                        onChange={handleChange}
                        inputProps={{ min: 1 }} // Set minimum value to 1
                        onWheel={(e) => e.target.blur()} // Prevent scrolling to change value
                    />
                    <Typography variant="body2">Selected Hours Worked: {selectedOpportunity.hoursWorked}</Typography>

                    <TextField
                        margin="dense"
                        label="Volunteers Needed"
                        name="volunteersNeeded"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={selectedOpportunity.volunteersNeeded}
                        onChange={handleChange}
                        inputProps={{ min: 1 }} // Set minimum value to 1
                        onWheel={(e) => e.target.blur()} // Prevent scrolling to change value
                    />
                    <Typography variant="body2">Selected Volunteers Needed: {selectedOpportunity.volunteersNeeded}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleSave} sx={{ backgroundColor: '#4CAF50', color: 'white' }}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VolunteerOpportunities;
