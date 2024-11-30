import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Container, Typography, Grid, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const VolunteerOpportunities = () => {
    const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedOpportunity, setSelectedOpportunity] = useState({
        title: '',
        description: '',
        registrationStartDate: '',
        registrationEndDate: '',
        volunteerDatetime: '',
        location: '',
        hoursWorked: 0,
        volunteersNeeded: 0,
        opportunityID: null,
        creatorId: null,
    });

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

    const handleOpen = (opportunity = {
        title: '', description: '', registrationStartDate: '', registrationEndDate: '', volunteerDatetime: '', location: '', hoursWorked: 0, volunteersNeeded: 0, opportunityID: null, creatorId: 0
    }) => {
        setSelectedOpportunity(opportunity);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedOpportunity({
            title: '', description: '', registrationStartDate: '', registrationEndDate: '', volunteerDatetime: '', location: '', hoursWorked: 0, volunteersNeeded: 0, opportunityID: null, creatorId: 0
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedOpportunity((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const confirmationMessage = selectedOpportunity.opportunityID
            ? "Are you sure you want to update this opportunity?"
            : "Are you sure you want to add this opportunity?";
    
        const confirmSave = window.confirm(confirmationMessage);
    
        if (confirmSave) {
            if (!selectedOpportunity.title || !selectedOpportunity.description || !selectedOpportunity.volunteerDatetime || !selectedOpportunity.location) {
                alert("Please fill in all required fields.");
                return;
            }
    
            try {
                const formData = new FormData();
                formData.append("title", selectedOpportunity.title);
                formData.append("description", selectedOpportunity.description);
                formData.append("registrationStartDate", selectedOpportunity.registrationStartDate);
                formData.append("registrationEndDate", selectedOpportunity.registrationEndDate);
                formData.append("volunteerDatetime", selectedOpportunity.volunteerDatetime);
                formData.append("location", selectedOpportunity.location);
                formData.append("hoursWorked", selectedOpportunity.hoursWorked);
                formData.append("volunteersNeeded", selectedOpportunity.volunteersNeeded);
                formData.append("creatorId", selectedOpportunity.creatorId);
    
                if (selectedOpportunity.volunteerImage) {
                    formData.append("volunteerImage", selectedOpportunity.volunteerImage);
                }
    
                console.log("Form data being sent:", formData);
    
                const headers = {
                    'Content-Type': 'multipart/form-data',
                };
    
                if (selectedOpportunity.opportunityID) {
                    await axios.put(`http://localhost:8080/api/volunteer/opportunity/${selectedOpportunity.opportunityID}`, formData, { headers });
                } else {
                    await axios.post('http://localhost:8080/api/volunteer/opportunity', formData, { headers });
                }
    
                fetchVolunteerOpportunities();
                handleClose();
            } catch (error) {
                console.error("Error saving opportunity:", error);
                alert("Error occurred while saving the opportunity. Please check the form data and try again.");
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
                                    {opportunity.volunteerDatetime ? new Date(opportunity.volunteerDatetime).toLocaleDateString() : "No date provided"}
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
                <DialogTitle>{selectedOpportunity.opportunityID ? 'Edit Volunteer Opportunity' : 'Add Volunteer Opportunity'}</DialogTitle>
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
                        label="Registration Start Date"
                        name="registrationStartDate"
                        type="datetime-local"
                        fullWidth
                        variant="outlined"
                        value={selectedOpportunity.registrationStartDate}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Registration End Date"
                        name="registrationEndDate"
                        type="datetime-local"
                        fullWidth
                        variant="outlined"
                        value={selectedOpportunity.registrationEndDate}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Volunteer Date"
                        name="volunteerDatetime"
                        type="datetime-local"
                        fullWidth
                        variant="outlined"
                        value={selectedOpportunity.volunteerDatetime}
                        onChange={handleChange}
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
                        inputProps={{ min: 1 }}
                        onWheel={(e) => e.target.blur()}
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
                        inputProps={{ min: 1 }}
                        onWheel={(e) => e.target.blur()}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#4CAF50', color: 'white' }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VolunteerOpportunities;
