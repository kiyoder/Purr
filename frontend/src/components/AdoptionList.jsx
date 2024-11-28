import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    Button,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AdoptionList = () => {
    const [adoptions, setAdoptions] = useState([]);
    const [editAdoption, setEditAdoption] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        const fetchAdoptions = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/adoptions');
                setAdoptions(response.data);
            } catch (error) {
                setError("Failed to load adoptions.");
            }
        };

        fetchAdoptions();
    }, []);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        setDeleteDialogOpen(false);
        if (!deleteId) return;

        try {
            await axios.delete(`http://localhost:8080/api/adoptions/${deleteId}`);
            setAdoptions(prevAdoptions => prevAdoptions.filter(adoption => adoption.adoptionID !== deleteId));
            setSuccessMessage("Adoption deleted successfully!");
            setDeleteId(null);
        } catch (error) {
            setError("Failed to delete adoption.");
        }
    };

    const handleEditAdoption = () => {
        setConfirmDialogOpen(true);
    };

    const handleConfirmUpdate = async () => {
        setConfirmDialogOpen(false);
        if (!editAdoption) return;

        try {
            const response = await axios.put(`http://localhost:8080/api/adoptions/${editAdoption.adoptionID}`, editAdoption);
            setAdoptions(prevAdoptions => prevAdoptions.map(adoption => (adoption.adoptionID === response.data.adoptionID ? response.data : adoption)));
            setEditDialogOpen(false);
            setEditAdoption(null);
            setSuccessMessage("Adoption updated successfully!");
        } catch (error) {
            setError("Failed to update adoption.");
        }
    };

    const handleEditClick = (adoption) => {
        setEditAdoption(adoption);
        setEditDialogOpen(true);
    };

    const renderAdoptionCards = (adoptionList) => (
        adoptionList.map((adoption) => (
            <Grid item xs={12} sm={6} md={5} key={adoption.adoptionID}>
                <Card style={styles.card}>
                    <CardContent>
                        <Typography variant="h6">ID: {adoption.adoptionID}</Typography>
                        <Typography variant="body1">Name: {adoption.name}</Typography>
                        <Typography variant="body1">Address: {adoption.address}</Typography>
                        <Typography variant="body1">Contact Number: {adoption.contactNumber}</Typography>
                        <Typography variant="body1">Pet Type: {adoption.petType}</Typography>
                        <Typography variant="body1">Breed: {adoption.breed}</Typography>
                        <Typography variant="body1">Description: {adoption.petDescription}</Typography>
                        <Typography variant="body1">Submission Date: {adoption.submissionDate}</Typography>
                        <Typography variant="body1">Status: {adoption.status}</Typography>
                        <div style={styles.buttonContainer}>
                            <IconButton color="primary" onClick={() => handleEditClick(adoption)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="primary" onClick={() => handleDeleteClick(adoption.adoptionID)}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        ))
    );

    return (
        <div style={styles.container}>
            <Typography variant="h4" sx={{ fontFamily: "'Caramel', sans-serif", fontWeight: "bold", color: '#5A20A8' }}>
                Adoption List
            </Typography>
            {error && <Typography variant="body1" sx={{ color: 'red' }}>{error}</Typography>}

            <Grid container spacing={4}>
                {/* Column for Adoption */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={styles.centeredLeftHeading}>Pending Adoptions</Typography>
                    <Grid container spacing={2}>
                        {renderAdoptionCards(adoptions.filter(adoption => adoption.status === 'PENDING'))}
                    </Grid>

                    <Typography variant="h6" sx={styles.centeredLeftHeading}>Approved Adoptions</Typography>
                    <Grid container spacing={2}>
                        {renderAdoptionCards(adoptions.filter(adoption => adoption.status === 'APPROVED'))}
                    </Grid>

                    <Typography variant="h6" sx={styles.centeredLeftHeading}>Rejected Adoptions</Typography>
                    <Grid container spacing={2}>
                        {renderAdoptionCards(adoptions.filter(adoption => adoption.status === 'REJECTED'))}
                    </Grid>
                </Grid>

                {/* Column for Rehome */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={styles.centeredRightHeading}>Pending Rehome</Typography>
                    <Grid container spacing={2}>
                        {renderAdoptionCards(adoptions.filter(adoption => adoption.status === 'PENDING_REHOME'))}
                    </Grid>

                    <Typography variant="h6" sx={styles.centeredRightHeading}>Accepted Rehome</Typography>
                    <Grid container spacing={2}>
                        {renderAdoptionCards(adoptions.filter(adoption => adoption.status === 'ACCEPTED_REHOME'))}
                    </Grid>
                </Grid>
            </Grid>

            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')} message={successMessage} />

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Adoption Status</DialogTitle>
                <DialogContent>
                    {editAdoption && (
                        <Select
                            label="Status"
                            value={editAdoption.status}
                            onChange={(e) => setEditAdoption({ ...editAdoption, status: e.target.value })}
                            variant="outlined"
                            fullWidth
                            sx={{ marginBottom: 2 }}
                        >
                            <MenuItem value="APPROVED">Approved</MenuItem>
                            <MenuItem value="REJECTED">Rejected</MenuItem>
                        </Select>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditAdoption} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Confirm Update</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to update this record?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmUpdate} variant="contained" color="primary">Do it</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this record?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" color="primary">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
    },
    card: {
            width: '300px',
            minHeight: '250px',
            margin: 'auto',
            marginBottom: '20px', // Add spacing between cards
            padding: '10px', // Optional: adds padding inside the card
        },
        buttonContainer: {
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'flex-end',
        },
    
    centeredLeftHeading: {
        textAlign: 'left',
        paddingLeft: '30%',
        fontFamily: "'Arial', sans-serif",
        fontWeight: "bold",
        color: '#5A20A8',
        marginBottom: '10px',
    },
    centeredRightHeading: {
        textAlign: 'right',
        paddingRight: '30%',
        fontFamily: "'Arial', sans-serif",
        fontWeight: "bold",
        color: '#5A20A8',
        marginBottom: '10px',
    },
};

export default AdoptionList;
