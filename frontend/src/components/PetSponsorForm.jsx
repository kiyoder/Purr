import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import axios from 'axios';

const PetSponsorForm = ({ pet, refreshPets, onClose }) => {
    // Initialize sponsorship details only once when pet details are available
    const [sponsorAmount, setSponsorAmount] = useState(0); // Store the input amount for sponsorship
    const [sponsorshipDetails, setSponsorshipDetails] = useState({
      amountGained: 0, // Default to 0
      amount: 0,
      expiryDate: "Not Set",
    });

    // Update sponsorship details when the pet is loaded or updated
    useEffect(() => {
        if (pet) {
            setSponsorshipDetails({
                amountGained: pet.pSE?.amountGained || 0,
                amount: pet.pSE?.amount || 0,
                expiryDate: pet.pSE?.sponsorshipDate || "Not Set",
            });
        }
    }, [pet]); // Run only when pet details change

    // Early return if pet is null or undefined
    if (!pet) {
      return <Typography>Loading...</Typography>;
    }

    const handleSponsorChange = (event) => {
      const value = event.target.value;
      setSponsorAmount(value);
    };

    const handleSponsorSubmit = () => {
        const newAmountGained = sponsorshipDetails.amountGained + sponsorAmount;
        setSponsorshipDetails((prevDetails) => ({
            ...prevDetails,
            amountGained: newAmountGained,
        }));

        // Send the updated sponsorship details to the server
        axios
            .post('http://localhost:8080/api/pet/updateSponsor', {
                petId: pet.pid,
                amountGained: newAmountGained,
            })
            .then((response) => {
                console.log('Sponsor update response:', response.data);
                refreshPets(); // Refresh the pets list after successful update
                onClose(); // Close the dialog after sponsorship
            })
            .catch((error) => {
                console.error('Error sponsoring the pet', error);
            });
    };

    return (
        <div>
            <Typography variant="h6">Sponsor {pet.name}</Typography>
            <Typography variant="body1">Breed: {pet.breed}</Typography>
            <Typography variant="body2">Type: {pet.type}</Typography>
            <Typography variant="body2">Age: {pet.age}</Typography>
            <Typography variant="body2">Current Sponsorship: ${sponsorshipDetails.amountGained}</Typography>
            <Typography variant="body2">Goal: ${sponsorshipDetails.amount}</Typography>
            <Typography variant="body2">Sponsorship Expiry: {sponsorshipDetails.expiryDate}</Typography>
            
            <TextField
                label="Amount to Sponsor"
                type="number"
                value={sponsorAmount}
                onChange={handleSponsorChange}
                fullWidth
                sx={{ mt: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button onClick={onClose} variant="outlined" color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSponsorSubmit} variant="contained" color="primary">
                    Sponsor
                </Button>
            </Box>
        </div>
    );
};

export default PetSponsorForm;
