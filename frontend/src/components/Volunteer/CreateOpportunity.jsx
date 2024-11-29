import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Container, Typography,
  Box, Grow, Fade, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateOpportunity = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    hoursWorked: 0,
    volunteersNeeded: 0,
    registrationStartDate: '',
    registrationEndDate: '',
    volunteerDatetime: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [userId, setUserId] = useState(null); // State for storing user ID
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage
    try {
      const storedUser = JSON.parse(localStorage.getItem('user')); // Parse the user object
      if (storedUser?.userId) {
        setUserId(storedUser.userId); // Extract userId from parsed object
      } else {
        setErrorMessage('User is not logged in.');
      }
    } catch (err) {
      setErrorMessage('Invalid user data in localStorage.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'hoursWorked' || name === 'volunteersNeeded'
        ? Math.max(0, value)
        : value,
    }));

    if (name === 'description') {
      const wordCount = value.trim().split(/\s+/).length;
      setDescriptionError(wordCount > 500 ? 'Description exceeds the maximum word limit of 500.' : '');
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    const previewUrl = URL.createObjectURL(e.target.files[0]);
    setImageUrl(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (descriptionError) {
      setErrorMessage('Please fix the errors before submitting.');
      return;
    }
  
    if (!userId) {
      setErrorMessage('User is not logged in.');
      return;
    }
  
    // Validate date logic
    if (new Date(formData.registrationEndDate) <= new Date(formData.registrationStartDate)) {
      setErrorMessage('Registration end date must be after the start date.');
      return;
    }
  
    if (new Date(formData.volunteerDatetime) <= new Date(formData.registrationEndDate)) {
      setErrorMessage('Volunteer event date must be after the registration end date.');
      return;
    }
  
    setOpenDialog(true);
  };
  
  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
  
      const requestData = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        requestData.append(key, value);
      }
  
      // Append the userId as the creatorId in the form data
      if (userId) {
        requestData.append('creatorId', userId); // Make sure this is the correct ID you want to send
      }
  
      if (imageFile) {
        requestData.append('volunteerImage', imageFile);
      }
  
      // Perform the POST request
      await axios.post('http://localhost:8080/api/volunteer/opportunity', requestData);
  
      // Navigate and reload the page after successful submission
      navigate('/volunteer', { replace: true });
      window.location.reload();
    } catch (error) {
      const serverError = error.response?.data?.message || 'Failed to create opportunity. Please try again.';
      setErrorMessage(serverError);
    } finally {
      setIsSubmitting(false);
      setOpenDialog(false);
    }
  };
  
  const handleCancel = () => setOpenDialog(false);
  const handleBack = () => navigate('/volunteer');

  const today = new Date().toISOString().split('T')[0];

  return (
    <Container maxWidth="sm">
      <Fade in timeout={700}>
        <Box mb={3} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Schedule Volunteer Work
          </Typography>
          <Typography variant="body1" paragraph>
            Create a volunteer opportunity by providing details below.
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
            error={Boolean(descriptionError)}
            helperText={descriptionError || 'Maximum 500 words'}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Registration Start Date"
                name="registrationStartDate"
                type="datetime-local"
                fullWidth
                value={formData.registrationStartDate}
                onChange={handleChange}
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().slice(0, 16) }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Registration End Date"
                name="registrationEndDate"
                type="datetime-local"
                fullWidth
                value={formData.registrationEndDate}
                onChange={handleChange}
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: formData.registrationStartDate || new Date().toISOString().slice(0, 16) }}
              />
            </Grid>
          </Grid>

          <TextField
            label="Volunteer Date and Time"
            name="volunteerDatetime"
            type="datetime-local"
            fullWidth
            value={formData.volunteerDatetime}
            onChange={handleChange}
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: formData.registrationEndDate || new Date().toISOString().slice(0, 16) }}
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
              disabled={isSubmitting || Boolean(descriptionError)}
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
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {errorMessage && <Typography color="error" variant="body2">{errorMessage}</Typography>}
    </Container>
  );
};

export default CreateOpportunity;
