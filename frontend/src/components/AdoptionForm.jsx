import React, { useState, useEffect } from 'react';
import { TextField, Button, Snackbar, Typography, Box } from '@mui/material';
import axios from 'axios';

const AdoptionForm = ({ pet }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contactNumber: '',
        submissionDate: '',
        breed: pet ? pet.breed : '',
        petDescription: pet ? pet.description : '',
        petType: pet ? pet.type : ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (pet) {
            setFormData({
                ...formData,
                breed: pet.breed,
                petDescription: pet.description,
                petType: pet.type,
            });
        }
    }, [pet]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'contactNumber' && !/^\d*$/.test(value)) {
            setErrorMessage('Contact number must be numeric');
            return;
        }

        if ((name === 'name' || name === 'address') && !/^[a-zA-Z\s]*$/.test(value)) {
            setErrorMessage('Name and address must only contain letters');
            return;
        }

        setErrorMessage('');
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.contactNumber.match(/^\d+$/)) {
            setErrorMessage('Contact number must be numeric');
            return;
        }

        if (!formData.name.match(/^[a-zA-Z\s]+$/) || !formData.address.match(/^[a-zA-Z\s]+$/)) {
            setErrorMessage('Name and address must only contain letters');
            return;
        }

        const newAdoption = {
            ...formData,
            status: 'PENDING',
            adoptionID: Date.now(),
        };

        resetForm();

        try {
            await axios.post('http://localhost:8080/api/adoptions', newAdoption);
            setSuccessMessage('Adoption form submitted successfully!');
        } catch (error) {
            console.error('Failed to submit the adoption form:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            contactNumber: '',
            submissionDate: '',
            breed: pet ? pet.breed : '',
            petDescription: pet ? pet.description : '',
            petType: pet ? pet.type : ''
        });
    };

    return (
        <div style={styles.container}>
            <Typography
                variant="h4"
                sx={{
                    color: '#5A20A8',
                    marginBottom: 2,
                    fontFamily: "'Caramel', sans-serif",
                    fontWeight: "bold"
                }}
            >
                Adoption Form
            </Typography>
            
            {/* Pet Image */}
            {pet && pet.image && (
                <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                    <img 
                        src={pet.image} 
                        alt={`${pet.type} - ${pet.breed}`} 
                        style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }} 
                    />
                </Box>
            )}
            
            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Left Column */}
                <div style={styles.column}>
                    <TextField
                        label="Pet Type"
                        name="type"
                        value={formData.petType}
                        variant="outlined"
                        fullWidth
                        disabled
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Breed of Pet"
                        name="breed"
                        value={formData.breed}
                        variant="outlined"
                        fullWidth
                        disabled
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Pet Description"
                        name="petDescription"
                        value={formData.petDescription}
                        variant="outlined"
                        multiline
                        rows={3}
                        fullWidth
                        disabled
                        sx={{ marginBottom: 2 }}
                    />
                </div>

                {/* Right Column */}
                <div style={styles.column}>
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Contact Number"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Submission Date"
                        type="date"
                        name="submissionDate"
                        value={formData.submissionDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        required
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                </div>

                {errorMessage && (
                    <Typography variant="body2" color="error" sx={{ marginBottom: 2, gridColumn: 'span 2' }}>
                        {errorMessage}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    type="submit"
                    sx={{
                        backgroundColor: '#5A20A8',
                        color: 'white',
                        gridColumn: 'span 2'
                    }}
                >
                    Submit Adoption
                </Button>
            </form>
            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
                message={successMessage}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: '#5A20A8',
                        color: 'white'
                    }
                }}
            />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px',
        margin: '0 auto',
        maxWidth: '800px',
    },
    form: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
    },
};

export default AdoptionForm;
