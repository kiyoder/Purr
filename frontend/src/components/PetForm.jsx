// PetForm Component
import React, { useState } from 'react'; // Import useState from React
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios'; // Import axios for HTTP requests
import { Button, Snackbar } from '@mui/material'; // Import Material UI components

const PetForm = ({ refreshPets }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add new pet
      await axios.post('http://localhost:8080/api/pet/postpetrecord', formData);
      setSuccessMessage('Pet added successfully!');
      
      // Call refreshPets to reload the pet list in PetList
      refreshPets();

      setTimeout(() => navigate('/adopt'), 2000);
    } catch (error) {
      console.error('Error saving pet data', error);
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
        {/* Form fields for pet data (name, type, breed, etc.) */}
        
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


// Define styles here
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
