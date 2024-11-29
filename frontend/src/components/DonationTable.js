import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Grid, Card, CardContent, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DonationTable = () => {
  const [donations, setDonations] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [donationToEdit, setDonationToEdit] = useState(null); // State to store the donation to edit
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/donations');
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/donations/${deleteId}`);
      setDonations(donations.filter(donation => donation.donationID !== deleteId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting donation:", error);
      setDeleteDialogOpen(false);
    }
  };

  const handleEditClick = (donation) => {
    setDonationToEdit(donation); // Set the donation to be edited
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:8080/api/donations/${donationToEdit.donationID}`, donationToEdit);
      setDonations(donations.map(donation => donation.donationID === donationToEdit.donationID ? donationToEdit : donation));
      setDonationToEdit(null); // Clear the edit form
    } catch (error) {
      console.error("Error updating donation:", error);
    }
  };

  const handleCancelEdit = () => {
    setDonationToEdit(null); // Cancel editing
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setDonationToEdit(prev => ({ ...prev, [name]: value })); // Update the edit form state
  };

  // New function to handle "Back to Donation" button click
  const handleBackClick = () => {
    navigate('/donate');
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Donation Records</Typography>
      <Button variant="outlined" onClick={handleBackClick}>Back to Donation</Button> {/* Added */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {donations.map((donation) => (
          <Grid item xs={12} sm={6} md={4} key={donation.donationID}>
            <Card>
              <CardContent>
                <Typography variant="h6">{donation.firstName} {donation.lastName}</Typography>
                <Typography variant="body2">Amount: ${donation.amount}</Typography>
                <Typography variant="body2">Date: {donation.donationDate}</Typography>
                <Typography variant="body2">Frequency: {donation.frequency}</Typography>
                <Typography variant="body2">Special Message: {donation.specialMessage}</Typography> {/* Added */}
                <Button color="primary" onClick={() => handleEditClick(donation)}>Edit</Button>
                <Button color="error" onClick={() => handleDeleteClick(donation.donationID)}>Delete</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit donation dialog */}
      {donationToEdit && (
        <Dialog open={true} onClose={handleCancelEdit}>
          <DialogTitle>Edit Donation</DialogTitle>
          <DialogContent>
            <DialogContentText>Edit the details of the donation</DialogContentText>
            <TextField
              label="Amount"
              name="amount"
              value={donationToEdit.amount}
              onChange={handleEditChange}
              fullWidth
              margin='normal'
            />
            <TextField
              label="Donation Date"
              name="donationDate"
              value={donationToEdit.donationDate}
              onChange={handleEditChange}
              fullWidth
              margin='normal'
            />
            <TextField
              label="First Name"
              name="firstName"
              value={donationToEdit.firstName}
              onChange={handleEditChange}
              fullWidth
              margin='normal'
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={donationToEdit.lastName}
              onChange={handleEditChange}
              fullWidth
              margin='normal'
            />
            <TextField
              label="Special Message"
              name="specialMessage"
              value={donationToEdit.specialMessage}
              onChange={handleEditChange}
              fullWidth
              margin='normal'
              multiline
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelEdit} color="primary">Cancel</Button>
            <Button onClick={handleSaveEdit} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Donation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this donation?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DonationTable;
