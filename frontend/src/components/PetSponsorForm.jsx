import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  DialogContentText,
  DialogContent,
} from '@mui/material';

const PetSponsorForm = ({ pet, onClose }) => {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(null);

  const handleSponsor = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/petSponsor/putPetSponsorDetails/${pet.pid}`, {
        amountGained: amount,
      });
      onClose();
    } catch (error) {
      setError('Failed to sponsor pet');
    }
  };

  return (
    <DialogContent>
      <DialogContentText>
        Enter the amount you would like to sponsor {pet.name}:
      </DialogContentText>
      <TextField
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.valueAsNumber)}
        label="Amount"
        fullWidth
      />
      {error && <DialogContentText color="error">{error}</DialogContentText>}
      <Button variant="contained" color="primary" onClick={handleSponsor}>
        Sponsor
      </Button>
    </DialogContent>
  );
};

export default PetSponsorForm;