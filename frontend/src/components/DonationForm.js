import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Snackbar, FormControl, InputLabel, Select, MenuItem, ToggleButton } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FeaturedImage from '../assets/featured.png';
import Paw from '../assets/paw.png';

const DonationForm = ({ onAdminClick, donationToEdit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    donationDate: '',
    frequency: '',
    firstName: '',
    lastName: '',
    specialMessage: '',
  });
  const [error, setError] = useState(''); // For error messages
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (donationToEdit) {
      setFormData({
        amount: donationToEdit.amount,
        donationDate: donationToEdit.donationDate,
        frequency: donationToEdit.frequency,
        firstName: donationToEdit.firstName || '',
        lastName: donationToEdit.lastName || '',
        specialMessage: donationToEdit.specialMessage || '',
      });
    }
  }, [donationToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.amount ||
      !formData.donationDate ||
      !formData.frequency
    ) {
      setError('Please fill out all required fields.');
      return; // Prevent submission
    }

    try {
      if (donationToEdit) {
        await axios.put(`http://localhost:8080/api/donations/${donationToEdit.donationID}`, formData);
        setSuccessMessage('Donation updated successfully!');
      } else {
        await axios.post('http://localhost:8080/api/donations', formData);
        setSuccessMessage('Donation submitted successfully!');
      }
      setSnackbarOpen(true);
      setError(''); // Clear any existing errors
    } catch (error) {
      console.error('Submission error:', error);
      setError('Submission failed. Please try again.');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/donation_dash');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', paddingTop: '50px' }}>
      <Box sx={{ flex: 5, display: 'flex', flexDirection: 'column', marginLeft: '100px' }}>
      <Typography variant="h5" sx={{ paddingBottom: '8px', fontWeight: 'bold' }}>
        FEATURED PET:
      </Typography>
      <Typography variant="h6" sx={{ paddingBottom: '8px' }}>
        Say hello to <span style={{ color: '#675BC8' }}>Max</span>! He is a 2-month-old Golden Retriever!
      </Typography>

        <img src={FeaturedImage} alt="Featured Pet" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
      </Box>

      <Box sx={{ flex: 5, display: 'flex', flexDirection: 'column', paddingTop: '20px' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{width: '800px', display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px',
            margin: '0 auto',
            gap: '16px',
            flex: 5,
            backgroundColor: '#F9F9F9',
            borderRadius: '8px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',}} >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <img src={Paw} alt="Paw" style={{ width: '20px', height: '20px' }} />
            <Typography variant="h6">{donationToEdit ? 'Update Donation' : 'Make a Donation'}</Typography>
          </Box>


          {error && (
            <Typography variant="body2" color="error" sx={{ marginBottom: '16px' }}>
              {error}
            </Typography>
          )}

          <TextField
            name="firstName"
            label="First Name"
            variant="outlined"
            sx={styles.textField}
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            name="lastName"
            label="Last Name"
            variant="outlined"
            sx={styles.textField}
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            name="amount"
            label="Amount"
            variant="outlined"
            sx={styles.textField}
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <TextField
            name="donationDate"
            label="Donation Date"
            variant="outlined"
            sx={styles.textField}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.donationDate}
            onChange={handleChange}
            required
          />
          <FormControl variant="outlined" fullWidth sx={styles.textField}>
            <InputLabel id="frequency-label">Frequency</InputLabel>
            <Select
              labelId="frequency-label"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              label="Frequency"
              required
            >
              <MenuItem value="One-time">One-time</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="specialMessage"
            label="Special Message"
            variant="outlined"
            sx={styles.textField}
            multiline
            rows={3}
            value={formData.specialMessage}
            onChange={handleChange}
          />

          <ToggleButton
            type="submit"
            sx={{
              border: "2px solid",
              borderRadius: "8px",
              padding: "12px 36px",
              borderColor: "primary.main",
              backgroundColor: "primary.main",
              color: "#fff",
              "&:hover": {
                backgroundColor: "white",
                color: "primary.main",
              },
            }}
          >
            {donationToEdit ? 'UPDATE' : 'DONATE'}
          </ToggleButton>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={successMessage}
          />
          {/*
          <ToggleButton
            onClick={handleAdminClick}
            sx={{
              border: "2px solid",
              borderRadius: "8px",
              padding: "12px 36px",
              borderColor: "primary.main",
              backgroundColor: "primary.main",
              color: "#fff",
              "&:hover": {
                backgroundColor: "white",
                color: "primary.main",
              },
            }}
          >
            ADMIN
          </ToggleButton>
          */}
        </Box>
      </Box>
    </Box>
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
    gap: '16px',
    flex: 5,
    backgroundColor: '#F9F9F9',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  textField: {
    width: '700px',
    marginBottom: '16px',
  },
};

export default DonationForm;
