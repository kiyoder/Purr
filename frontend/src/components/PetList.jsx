import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  Box,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Chip,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  ToggleButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AdoptionForm from './AdoptionForm';
import PetForm from './PetForm';
import PetFormUpdate from './PetFormUpdate';

// Import predetermined images for each pet type
import dogImage from '../assets/golden_retriever.jpg';
import catImage from '../assets/siamese.jpg';
import birdImage from '../assets/cockatiel.jpg';
import rabbitImage from '../assets/golden_retriever.jpg';
import reptileImage from '../assets/siamese.jpg';
import fishImage from '../assets/cockatiel.jpg';
import defaultImage from '../assets/logo_colored.png';

const PetList = () => {
  const [pets, setPets] = useState([]); // To hold both static and dynamic pets
  const [openAdoption, setOpenAdoption] = useState(false);
  const [openRehome, setOpenRehome] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation modal
  const [petToDelete, setPetToDelete] = useState(null); // State to hold pet that is selected for deletion
  const [openEdit, setOpenEdit] = useState(false); // State for edit modal
  const [petToEdit, setPetToEdit] = useState(null); // Pet data to edit
  
  const staticPets = [
    {
      pid: 97,
      breed: 'Golden Retriever',
      type: 'Dog',
      name: 'Buddy',
      age: '3 years',
      status: 'Available',
      description: 'A friendly and intelligent breed.',
    },
    {
      pid: 98,
      breed: 'Siamese',
      type: 'Cat',
      name: 'Mittens',
      age: '2 years',
      status: 'Available',
      description: 'An affectionate and playful breed.',
    },
    {
      pid: 99,
      breed: 'Cockatiel',
      type: 'Bird',
      name: 'Chirpy',
      age: '1 year',
      status: 'Available',
      description: 'A social and curious companion.',
    },
  ];

  const fetchPets = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/pet/getAllPets');
      // Merging fetched pets with staticPets
      setPets([...response.data, ...staticPets]); 
    } catch (error) {
      console.error('Error fetching pet list', error);
      // In case of error, just use the staticPets
      setPets(staticPets);
    }
  };

  useEffect(() => {
    fetchPets(); // Fetch the pet data on component mount
  }, []); // Empty dependency array to run only once

  const petTypeToImage = {
    Dog: dogImage,
    Cat: catImage,
    Bird: birdImage,
    Rabbit: rabbitImage,
    Reptile: reptileImage,
    Fish: fishImage,
  };

  const handleAdoptionOpen = (pet) => {
    setSelectedPet(pet);
    setOpenAdoption(true);
  };

  const handleAdoptionClose = () => {
    setOpenAdoption(false);
    setSelectedPet(null);
  };

  const handleRehomeOpen = () => {
    setOpenRehome(true);
  };

  const handleRehomeClose = () => {
    setOpenRehome(false);
  };

  const handleDeleteOpen = (pet) => {
    setPetToDelete(pet);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setPetToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDeletePet = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/pet/deletePetDetails/${petToDelete.pid}`);
      setPets(pets.filter((pet) => pet.pid !== petToDelete.pid)); // Remove deleted pet from the state
      handleDeleteClose(); // Close the confirmation dialog
    } catch (error) {
      console.error('Error deleting pet', error);
    }
  };

  const handleEditOpen = (pet) => {
    setPetToEdit({ pid: pet.pid }); // Pass only the pet ID
    setOpenEdit(true); // Open the modal
  };
  
  
  const handleEditClose = () => {
    setOpenEdit(false); // Close the modal
    setPetToEdit(null); // Clear the selected pet
  };
  
  const getPetImage = (type) => petTypeToImage[type] || defaultImage;

  return (
    <div style={styles.pageContainer}>
      <Typography variant="h6" sx={{ mb: 3, color: '#5A20A8', fontWeight: 'bold' }}>
        List of Pets to Adopt
      </Typography>
      <div style={styles.listContainer}>
        {pets.length > 0 ? (
          pets.map((pet, index) => (
            <Card
              key={index}
              sx={{ width: 300, height: 400, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              onClick={() => handleAdoptionOpen(pet)}
            >
              <CardMedia
                component="img"
                height="140"
                image={getPetImage(pet.type)}
                alt={pet.type}
                sx={{ objectFit: 'cover' }}
              />
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
                  Name:
                </Typography>
                <Typography color="#5A20A8" fontWeight="bold" sx={{ ml: 2 }}>
                  {pet.name}
                </Typography>
                <Typography color="#5A20A8" fontSize="12px" fontWeight="bold">
                  Age:
                </Typography>
                <Typography color="#5A20A8" fontWeight="bold" sx={{ ml: 2 }}>
                  {pet.age}
                </Typography>
                <Typography color="#5A20A8" fontSize="12px" fontWeight="bold">
                  Status:
                </Typography>
                <Typography color="#5A20A8" fontWeight="bold" sx={{ ml: 2 }}>
                  {pet.status}
                </Typography>
                <Typography color="#5A20A8" fontStyle="italic" fontWeight="bold" noWrap>
                  {pet.description}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ marginTop: '8px', marginRight: '8px' }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the pet detail modal
                    handleEditOpen(pet); // Pass the selected pet
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ marginTop: '8px' }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the pet detail modal
                    handleDeleteOpen(pet);
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="#5A20A8" fontWeight="bold">
            No pets available for adoption at the moment.
          </Typography>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteClose}>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleDeleteClose}
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
          <Typography variant="h6">Are you sure you want to delete this pet?</Typography>
          <Button
            variant="contained"
            color="error"
            sx={{ marginTop: '16px' }}
            onClick={handleDeletePet}
          >
            Confirm Delete
          </Button>
          <Button
            variant="outlined"
            sx={{ marginTop: '16px', marginLeft: '8px' }}
            onClick={handleDeleteClose}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal for Adoption Form */}
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

      {/* Modal for Rehome Form */}
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
          <PetForm refreshPets={fetchPets} onClose={handleRehomeClose} />
        </DialogContent>
      </Dialog>

      {/*Modal for Edit Pet*/}
      <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="md">
        <DialogTitle>
          Edit Pet
          <IconButton
            aria-label="close"
            onClick={handleEditClose}
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
          <PetFormUpdate
            petId={petToEdit?.pid} // Pass petId
            refreshPets={fetchPets} // Refresh pets list after update
            onClose={handleEditClose} // Close the modal when done
          />
        </DialogContent>
      </Dialog>

      {/* Rehome Button at the Bottom */}
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
          onClick={handleRehomeOpen}
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
      </Box>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    padding: '20px',
    paddingBottom: '80px', // Add padding to avoid overlap with the rehome bar
  },
  listContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'flex-start',
    width: '100%',
  },
};

export default PetList;
