import React, { useState } from 'react';
import {
  Card,
  Box,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Chip,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import AdoptionForm from './AdoptionForm'; 
import RehomeForm from './RehomeForm';
import goldenImage from '../assets/golden_retriever.jpg';
import siameseImage from '../assets/siamese.jpg';
import cockatielImage from '../assets/cockatiel.jpg';

const PetList = () => {
  const [openAdoption, setOpenAdoption] = useState(false);
  const [openRehome, setOpenRehome] = useState(false); // Add this line
  const [selectedPet, setSelectedPet] = useState(null);
  const navigate = useNavigate();

  const pets = [
    {
      petId: 'P001', // Added Pet ID
      image: goldenImage,
      breed: 'Golden Retriever',
      type: 'Dog',
      name: 'Buddy',
      age: 3,
      gender: 'Male',
      description: 'A friendly and intelligent breed.',
    },
    {
      petId: 'P002', // Added Pet ID
      image: siameseImage,
      breed: 'Siamese',
      type: 'Cat',
      name: 'Luna',
      age: 2,
      gender: 'Female',
      description: 'An affectionate and playful breed.',
    },
    {
      petId: 'P003', // Added Pet ID
      image: cockatielImage,
      breed: 'Cockatiel',
      type: 'Bird',
      name: 'Sunny',
      age: 1,
      gender: 'Male',
      description: 'A social and curious companion.',
    },
  ];

  const handleCardClick = (pet) => {
    setSelectedPet(pet);
    setOpenAdoption(true);
  };

  const handleAdoptionClose = () => {
    setOpenAdoption(false);
    setSelectedPet(null);
  };

  const handleRehomeClick = () => {
    setOpenRehome(true);
  };

  const handleRehomeClose = () => {
    setOpenRehome(false);
  };

  const handleListOpen = () => {
    navigate('/admin/adoption-list');
  };

  return (
    <>
      <div style={styles.pageContainer}>
      <Typography variant="h6" component="h6" sx={{ color: '#5A20A8', fontWeight: 'bold', padding: '20px' }}>
  List of Pets to Adopt
</Typography>

        <div style={styles.listContainer}>
          {pets.length > 0 ? (
            pets.map((pet, index) => (
              <Card
                key={index}
                sx={{
                  width: 360,
                  height: 590, // Increased height to accommodate all content
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                onClick={() => handleCardClick(pet)}
              >
                {pet.image ? (
                  <CardMedia
                    component="img"
                    height="140"
                    image={pet.image}
                    alt={pet.breed}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 140,
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No Image Available
                    </Typography>
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={pet.type}
                      variant="outlined"
                      color="primary"
                      sx={{
                        fontWeight: 'bold',
                        borderWidth: 1.5,
                        borderColor: 'primary.main',
                      }}
                    />
                    <Chip
                      label={pet.breed}
                      variant="outlined"
                      color="primary"
                      sx={{
                        fontWeight: 'bold',
                        borderWidth: 1.5,
                        borderColor: 'primary.main',
                      }}
                    />
                  </Stack>
                  <Typography color="#5A20A8" fontSize="12px" fontWeight="bold">
                    Pet ID
                  </Typography>
                  <Typography color="#5A20A8" fontWeight="bold" sx={{ ml: 2 }}>
                    {pet.petId} {/* Display Pet ID */}
                  </Typography>
                  <Typography color="#5A20A8" fontSize="12px" fontWeight="bold">
                    Name
                  </Typography>
                  <Typography color="#5A20A8" fontWeight="bold" sx={{ ml: 2 }}>
                    {pet.name} {/* Display pet name */}
                  </Typography>
                  <Typography color="#5A20A8" fontSize="12px" fontWeight="bold">
                    Pet Type
                  </Typography>
                  <Typography color="#5A20A8" fontWeight="bold" sx={{ ml: 2 }}>
                    {pet.type}
                  </Typography>
                  <Typography color="#5A20A8" fontSize="12px" fontWeight="bold">
                    Breed
                  </Typography>
                  <Typography color="#5A20A8" fontWeight="bold" sx={{ ml: 2 }}>
                    {pet.breed}
                  </Typography>
                  <Typography color="#5A20A8" fontSize="12px" fontWeight="bold">
                    Age
                  </Typography>
                  <Typography color="#5A20A8" fontWeight="bold" sx={{ ml: 2 }}>
                    {pet.age} years {/* Display pet age */}
                  </Typography>
                  <Typography color="#5A20A8" fontSize="12px" fontWeight="bold">
                    Gender
                  </Typography>
                  <Typography color="#5A20A8" fontWeight="bold" sx={{ ml: 2 }}>
                    {pet.gender} {/* Display pet gender */}
                  </Typography>
                  <br />
                  <Typography color="#5A20A8" fontStyle="italic" fontWeight="bold" noWrap>
                    {pet.description}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" color="#5A20A8" fontWeight="bold">
              No pets available for adoption at the moment.
            </Typography>
          )}
        </div>
      </div>

      <Dialog open={openAdoption} onClose={handleAdoptionClose} fullWidth maxWidth="md">
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleAdoptionClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AdoptionForm pet={selectedPet} />
        </DialogContent>
      </Dialog>

      <Dialog open={openRehome} onClose={handleRehomeClose} fullWidth maxWidth="md">
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleRehomeClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <RehomeForm />
        </DialogContent>
      </Dialog>

      <Box
        sx={{
          width: '100vw',
          backgroundColor: '#6c5ce7',
          color: 'white',
          textAlign: 'center',
          padding: '8px 0',
          position: 'fixed',
          bottom: 0,
          left: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h7" fontWeight="bold" sx={{ mr: 2 }}>
          Do you want to rehome your pet?
        </Typography>
        <ToggleButton
          onClick={handleRehomeClick}
          sx={{
            border: '2px solid',
            borderRadius: '25px',
            padding: '12px 36px',
            borderColor: '#6c5ce7',
            backgroundColor: '#6c5ce7',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'white',
              color: '#6c5ce7',
            },
          }}
        >
          Rehome
        </ToggleButton>
        <ToggleButton
          onClick={handleListOpen}
          sx={{
            border: '2px solid',
            borderRadius: '25px',
            padding: '12px 36px',
            borderColor: '#6c5ce7',
            backgroundColor: '#6c5ce7',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'white',
              color: '#6c5ce7',
            },
          }}
        >
          Admin
        </ToggleButton>
      </Box>
    </>
  );
};

const styles = {
  pageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    minHeight: '100vh',
  },
  listContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'flex-start',
    padding: '10px',
  },
};

export default PetList;
