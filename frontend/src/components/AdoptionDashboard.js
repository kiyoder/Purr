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

const AdoptionDashboard = () => {
    const [adoptions, setAdoptions] = useState([]);
    const [editAdoption, setEditAdoption] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    // Fetch adoption records
    useEffect(() => {
        const fetchRecords = async () => {
            setError('');
            try {
                const adoptionResponse = await axios.get('http://localhost:8080/api/adoptions');
                setAdoptions(adoptionResponse.data);
            } catch (error) {
                setError('Failed to load records.');
            }
        };
        fetchRecords();
    }, []);

    const handleEditClick = (adoption) => {
        setEditAdoption(adoption);
        setNewStatus(adoption.status);
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (adoptionId) => {
        setDeleteId(adoptionId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/adoptions/${deleteId}`);
            setAdoptions(adoptions.filter((adoption) => adoption.adoptionID !== deleteId));
            setSuccessMessage('Adoption record deleted successfully!');
        } catch (error) {
            setError('Failed to delete adoption record.');
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    // Close the edit dialog
    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setEditAdoption(null);
    };

    // Handle status change
    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    // Save the updated adoption information (only status)
    const handleSaveAdoption = async () => {
        try {
            if (editAdoption) {
                const updatedAdoption = { ...editAdoption, status: newStatus };
    
                // Update adoption in the adoption backend
                await axios.put(`http://localhost:8080/api/adoptions/${editAdoption.adoptionID}`, updatedAdoption);
    
                // If approved, update pet's adoption status in the pet backend
                if (newStatus === 'APPROVED') {
                    await axios.put(`http://localhost:8080/api/pets/${editAdoption.petID}`, { isAdopted: true });
                }
    
                setAdoptions((prev) =>
                    prev.map((adoption) =>
                        adoption.adoptionID === editAdoption.adoptionID ? { ...adoption, ...updatedAdoption } : adoption
                    )
                );
                setSuccessMessage('Adoption record updated successfully!');
            }
        } catch (error) {
            setError('Failed to update adoption record.');
        } finally {
            handleDialogClose();
        }
    };

    const renderAdoptionCards = (adoptionList) => (
        adoptionList.map((adoption) => (
            <Grid item xs={12} sm={6} md={4} key={adoption.adoptionID}>
                <Card style={styles.card}>
                    <CardContent>
                        <Typography variant="h6">ID: {adoption.adoptionID}</Typography>
                        <Typography variant="body1">Name: {adoption.name}</Typography>
                        <Typography variant="body1">Address: {adoption.address}</Typography>
                        <Typography variant="body1">Contact Number: {adoption.contactNumber}</Typography>
                        <Typography variant="body1">Pet Type: {adoption.petType}</Typography>
                        <Typography variant="body1">Breed: {adoption.breed}</Typography>
                        <Typography variant="body1">Description: {adoption.description}</Typography>
                        <Typography variant="body1">Submission Date: {adoption.adoptionDate}</Typography>
                        <Typography variant="body1">Status: {adoption.status}</Typography>
                        <div style={styles.buttonContainer}>
                            <IconButton
                                color="primary"
                                onClick={() => handleEditClick(adoption)}
                                disabled={adoption.status !== 'PENDING'} // Disable if status is not PENDING
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton color="secondary" onClick={() => handleDeleteClick(adoption.adoptionID)}>
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
            {error && <Typography variant="body1" sx={{ color: 'red' }}>{error}</Typography>}
            <Grid container spacing={3}>
                <Grid item xs={12} md={9}>
                    <Typography variant="h6" sx={styles.centeredLeftHeading}>Pending Adoptions</Typography>
                    <Grid container spacing={1}>
                        {renderAdoptionCards(adoptions.filter(adoption => adoption.status === 'PENDING'))}
                    </Grid>

                    <Typography variant="h6" sx={styles.centeredLeftHeading}>Approved Adoptions</Typography>
                    <Grid container spacing={3}>
                        {renderAdoptionCards(adoptions.filter(adoption => adoption.status === 'APPROVED'))}
                    </Grid>

                    <Typography variant="h6" sx={styles.centeredLeftHeading}>Rejected Adoptions</Typography>
                    <Grid container spacing={3}>
                        {renderAdoptionCards(adoptions.filter(adoption => adoption.status === 'REJECTED'))}
                    </Grid>
                </Grid>
            </Grid>

            {/* Edit Dialog (only for status change) */}
            <Dialog open={editDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Edit Adoption Status</DialogTitle>
                <DialogContent>
                    <Select
                        label="Status"
                        value={newStatus}
                        onChange={handleStatusChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="APPROVED">Approved</MenuItem>
                        <MenuItem value="REJECTED">Rejected</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSaveAdoption} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Are you sure you want to delete this adoption?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="primary">Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
                message={successMessage}
            />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    card: {
        width: '300px',
        minHeight: '250px',
        margin: 'auto',
        marginBottom: '20px',
        padding: '10px',
    },
    buttonContainer: {
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    centeredLeftHeading: {
        textAlign: 'left',
        fontFamily: "'Arial', sans-serif",
        fontWeight: 'bold',
        color: '#5A20A8',
        marginBottom: '10px',
    },
};

export default AdoptionDashboard;
