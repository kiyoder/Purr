import React, { useState } from 'react';
import {
  Button, TextField, Container, Typography,
  Box, Grow, Fade, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';  // Added Dialog-related imports
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateOpportunity = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    hoursWorked: 0,
    volunteersNeeded: 0
  });
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // State to prevent multiple submissions
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === "hoursWorked" || name === "volunteersNeeded"
        ? Math.max(0, value) // Prevent negative values
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenDialog(true); // Open confirmation dialog before submitting
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await axios.post('http://localhost:8080/api/volunteer/opportunity', formData);
      navigate('/volunteer'); // Redirect to the Volunteer page after successful submission
    } catch (error) {
      console.error("Error creating opportunity:", error);
    } finally {
      setIsSubmitting(false);
      setOpenDialog(false); // Close the dialog after submission attempt
    }
  };

  const handleCancel = () => {
    setOpenDialog(false); // Close the dialog without submitting
  };

  const handleBack = () => {
    navigate('/volunteer'); // Redirect to the Volunteer page when the Back button is clicked
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <Container maxWidth="sm" sx={{ mt: 2, py: 4 }}> {/* Added top margin and padding */}
      
      <Fade in timeout={700}>
        <Box mb={3} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Schedule Volunteer Work
          </Typography>
          <Typography variant="body1" paragraph>
            Use this form to create a volunteer opportunity for others. Please provide details like title, description, date, location, and required volunteers.
          </Typography>
        </Box>
      </Fade>

      <Fade in timeout={800}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            required
            margin="normal"
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '20px', // Apply more circular border radius to the input field
              },
            }}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            value={formData.description}
            onChange={handleChange}
            required
            margin="normal"
            multiline
            rows={4}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '20px', // Apply more circular border radius to the input field
              },
            }}
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            fullWidth
            value={formData.date}
            onChange={handleChange}
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: today }} // Prevent selecting past dates
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '20px', // Apply more circular border radius to the input field
              },
            }}
          />
          <TextField
            label="Location"
            name="location"
            fullWidth
            value={formData.location}
            onChange={handleChange}
            required
            margin="normal"
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '20px', // Apply more circular border radius to the input field
              },
            }}
          />
          <TextField
            label="Hours Worked"
            name="hoursWorked"
            type="number"
            fullWidth
            value={formData.hoursWorked}
            onChange={handleChange}
            required
            margin="normal"
            inputProps={{ min: 0 }} // Prevent negative input
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '20px', // Apply more circular border radius to the input field
              },
            }}
          />
          <TextField
            label="Volunteers Needed"
            name="volunteersNeeded"
            type="number"
            fullWidth
            value={formData.volunteersNeeded}
            onChange={handleChange}
            required
            margin="normal"
            inputProps={{ min: 0 }} // Prevent negative input
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '20px', // Apply more circular border radius to the input field
              },
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleBack}
              sx={{
                borderRadius: '30px',
                width: '48%', // Set width to 48% for both buttons
                py: 1.5, // Set the vertical padding for consistent height
                height: '100%', // Ensure both buttons have the same height
              }}
            >
              Back
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{
                borderRadius: '30px',
                width: '48%', // Set width to 48% for both buttons
                py: 1.5, // Set the vertical padding for consistent height
                height: '100%', // Ensure both buttons have the same height
                background: 'linear-gradient(45deg, #B39DDB 30%, #D1C4E9 90%)',
                color: '#fff',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #9575CD 30%, #C5CAE9 90%)',
                },
                '&:disabled': {
                  background: '#ddd',
                  color: '#888'
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Create Opportunity'}
            </Button>
          </Box>

        </form>
      </Fade>

      {/* Confirmation Dialog with Grow Animation */}
      <Dialog
        open={openDialog}
        onClose={handleCancel}
        aria-labelledby="confirmation-dialog-title"
        TransitionComponent={Grow}
      >
        <DialogTitle id="confirmation-dialog-title">Confirm Creation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to create this volunteer opportunity?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateOpportunity;
