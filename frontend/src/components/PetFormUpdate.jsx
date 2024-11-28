import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  MenuItem,
  Snackbar,
} from '@mui/material';

const PetFormUpdate = ({ petId, refreshPets, onClose }) => { 
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    gender: '',
    description: '',
    photo: '',
    status: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Use the petId passed as prop for fetching and updating pet
  const { id } = useParams(); // Get pet ID from URL, but ensure petId prop takes priority for direct update

  useEffect(() => {
    if (petId || id) { // Fetch pet data using petId passed from PetList or URL param if directly accessed
      const petIdentifier = petId || id;
      axios
        .get(`http://localhost:8080/api/pet/getPet/${petIdentifier}`)
        .then((response) => setFormData(response.data))
        .catch((error) => console.error('Error fetching pet data:', error));
    }
  }, [petId, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const petIdentifier = petId || id;
      await axios.put(
        `http://localhost:8080/api/pet/putPetDetails?pid=${petIdentifier}`,
        formData
      );
      setSuccessMessage('Pet updated successfully!');
      refreshPets(); // Call refreshPets from parent to reload the pet list
      if (onClose) onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating pet data:', error);
      setErrorMessage('Failed to update pet data.');
    }
  };

  const handleSnackbarClose = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 5 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Edit Pet
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {['Dog', 'Cat', 'Bird', 'Rabbit', 'Reptile', 'Fish', 'Other'].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                {['Male', 'Female', 'Unknown'].map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Photo URL"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                {['Available', 'Adopted', 'Pending'].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
              Update Pet
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar for success/error message */}
      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={successMessage || errorMessage}
      />
    </Container>
  );
};

export default PetFormUpdate;
