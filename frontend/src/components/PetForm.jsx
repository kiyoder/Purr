import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import { Button, Snackbar, TextField, MenuItem, FormControlLabel, Checkbox } from '@mui/material'; 

const PetForm = ({ refreshPets, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    gender: '',
    description: '',
    photo: '',
    status: '',
    allowSponsorship: '',
    amount: '',
    expiryDate: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const petTypes = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Reptile', 'Fish', 'Other'];
  const petStatuses = ['Available', 'Adopted', 'Pending'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Send POST request for pet details
        const petResponse = await axios.post('http://localhost:8080/api/pet/postpetrecord', formData);
        const petId = petResponse.data.pid; // Assuming the backend returns the pet's ID

        if (formData.allowSponsorship) {
            // Prepare sponsorship data
            const sponsorshipData = {
                amount: formData.amount,
                expiryDate: formData.expiryDate,
            };

            // Send POST request for sponsorship details
            const sponsorshipResponse = await axios.post(`http://localhost:8080/api/petSponsor/postPetSponsorRecord?petId=${petId}`, sponsorshipData);
            console.log('Sponsorship response:', sponsorshipResponse.data); // Log response for debugging
        }

        setSuccessMessage('Pet and sponsorship added successfully!');
        refreshPets(); // Refresh the pet list
        if (onClose) onClose(); // Close the form dialog
    } catch (error) {
        console.error('Error saving pet or sponsorship data:', error);
        const message = error.response ? error.response.data.message : 'Failed to save pet or sponsorship data.';
        setSuccessMessage(message); // Display detailed error message
    }
};

  const handleSnackbarClose = () => {
    setSuccessMessage('');
  };

  return (
    <div style={styles.container}>
      <h2>Add Pet</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {petTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Breed"
          name="breed"
          value={formData.breed}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Photo URL"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {petStatuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>

        {/* Checkbox for allowing sponsorship */}
        <div style={{ marginTop: '20px' }}>
          <FormControlLabel
            control={
              <Checkbox
                name="allowSponsorship"
                checked={formData.allowSponsorship}
                onChange={handleChange} // This will toggle allowSponsorship correctly.
              />
            }
            label="Allow Sponsorship"
          />

          {/* Conditionally render the amount and sponsorship date fields if allowSponsorship is true */}
          {formData.allowSponsorship && (
            <>
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Expiration Date"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </>
          )}
        </div>

        <div style={{ marginTop: '20px' }}>
          <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
            Add Pet
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/adopt')}
          >
            Cancel
          </Button>
        </div>
      </form>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
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
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
    margin: '0 auto',
    maxWidth: '600px',
  },
};

export default PetForm;
