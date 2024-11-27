import React, { useState } from 'react';
import {
  Button, TextField, Container, Typography,
  Box, Grow, Fade, Dialog, DialogTitle, DialogContent, DialogActions, Grid
} from '@mui/material'; // Added Grid import
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateOpportunity = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    hoursWorked: 0,
    volunteersNeeded: 0,
  });
  const [imageFile, setImageFile] = useState(null); // State for the image file
  const [imageUrl, setImageUrl] = useState(''); // State for the image URL after upload
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // State to prevent multiple submissions
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'hoursWorked' || name === 'volunteersNeeded'
        ? Math.max(0, value) // Prevent negative values
        : value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Update state with the selected image file
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    setImageUrl(imageUrl); // Set image preview URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenDialog(true); // Open confirmation dialog before submitting
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(''); // Clear previous errors

      const requestData = new FormData();
      // Append form data fields to FormData
      for (const [key, value] of Object.entries(formData)) {
        requestData.append(key, value);
      }

      // Append image file if selected
      if (imageFile) {
        requestData.append('volunteerImage', imageFile); // Add image file to FormData
      }

      // Send request without specifying Content-Type (FormData automatically sets it)
      await axios.post('http://localhost:8080/api/volunteer/opportunity', requestData);

      navigate('/volunteer', { replace: true });
      window.location.reload(); // Refresh page after submission
    } catch (error) {
      console.error('Error creating opportunity:', error);
      setErrorMessage('Failed to create opportunity. Please try again.');
    } finally {
      setIsSubmitting(false);
      setOpenDialog(false); // Close confirmation dialog
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
    <Container maxWidth="sm">
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
            inputProps={{ min: today }}
          />
          <TextField
            label="Location"
            name="location"
            fullWidth
            value={formData.location}
            onChange={handleChange}
            required
            margin="normal"
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Hours Worked"
                name="hoursWorked"
                type="number"
                fullWidth
                value={formData.hoursWorked}
                onChange={handleChange}
                required
                margin="normal"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Volunteers Needed"
                name="volunteersNeeded"
                type="number"
                fullWidth
                value={formData.volunteersNeeded}
                onChange={handleChange}
                required
                margin="normal"
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Upload Volunteer Image (Optional):
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ margin: '15px 0' }}
          />
          {imageUrl && <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', height: 'auto', marginTop: '15px' }} />}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Create Opportunity'}
            </Button>
          </Box>
        </form>
      </Fade>

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
