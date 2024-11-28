import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import { Button, Snackbar, TextField, MenuItem } from '@mui/material'; 

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
  });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const petTypes = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Reptile', 'Fish', 'Other'];
  const petStatuses = ['Available', 'Adopted', 'Pending'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to the Spring Boot backend
      await axios.post('http://localhost:8080/api/pet/postpetrecord', formData);
      setSuccessMessage('Pet added successfully!');

      // Refresh the pet list
      refreshPets();

      // Close the form dialog
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving pet data:', error);
      setSuccessMessage('Failed to save pet data.');
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
