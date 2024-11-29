import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Grid, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ToggleButton } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import landingImage from '../assets/landing.png'; // Import the image
import mockImage from '../assets/mock.png';
import petPlaceholder from '../assets/petplaceholder.png';

const Home = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    image: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/newsfeed');
      const updatedArticles = response.data.map(article => ({
        ...article,
        image: article.image ? `http://localhost:8080/uploads/${article.image}` : null, // Adjust based on your backend setup
      }));
      setArticles(updatedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };
  

  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result); // Store the Base64 string
      };
      reader.readAsDataURL(file); // Convert the file to a Base64 string
    }
  };

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', formData.title);
    formData.append('content', formData.content);
    formData.append('author', formData.author);
    if (uploadedImage) {
      formData.append('image', uploadedImage);
    }
  
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEditing && currentId) {
        await axios.put(`http://localhost:8080/api/newsfeed/${currentId}`, formData, config);
        setSuccessMessage('Article updated successfully!');
      } else {
        await axios.post('http://localhost:8080/api/newsfeed', formData, config);
        setSuccessMessage('Article posted successfully!');
      }
      fetchArticles();
      resetForm();
    } catch (error) {
      console.error('Submission error:', error);
    }
  };
  
  

  const resetForm = () => {
    setFormData({ title: '', content: '', author: '' });
    setUploadedImage(null);
    setIsEditing(false);
    setCurrentId(null);
  };
  

  const handleEdit = (article) => {
    setFormData(article);
    setIsEditing(true);
    setCurrentId(article.articleID);
  };

  const handleDeleteClick = (articleID) => {
    setDeleteId(articleID);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/newsfeed/${deleteId}`);
      setArticles(articles.filter(article => article.articleID !== deleteId));
      setDeleteDialogOpen(false);
    } catch (error) {
      setDeleteDialogOpen(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  // Function to format the date to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Redirect to the AdoptionForm page when 'Adopt Now' button is clicked
  const handleAdoptNowClick = () => {
    navigate('/adopt'); // Use navigate to redirect to the AdoptionForm page
  };

  return (
    <Box sx={{ padding: 3 }}>

      {/* Page Layout */}
      <Grid container spacing={3} sx={{padding: '50px'}}>
        {/* Left Side */}
        <Grid item xs={5} container justifyContent="center" alignItems="center">
          <Typography variant="h3"> {/* Reduced margin-bottom */}
            Give a New Life to PURR
          </Typography>
          <Typography variant="h5"> {/* Reduced margin-bottom */}
            Pet adoption and rehoming are both vital aspects of animal welfare, offering hope and a fresh start to pets in need.
            Open your heart and your home to a shelter pet.
          </Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <ToggleButton value="adopt"
              onClick={handleAdoptNowClick} // Add the handleAdoptNowClick function here
              sx={{
                border: '2px solid',
                borderRadius: '8px',
                padding: '12px 36px',
                borderColor: 'primary.main',
                backgroundColor: 'primary.main',
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'primary.main',
                },
              }}
            >
              Adopt Now
            </ToggleButton>

            <ToggleButton value="adopt"
              onClick={handleSubmit}
              sx={{
                border: '2px solid',
                borderRadius: '8px',
                padding: '12px 36px',
                borderColor: 'secondary.main',
                backgroundColor: 'secondary.main',
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'secondary.main',
                },
              }}
            >
              Rehome Now
            </ToggleButton>
          </Box>
        </Grid>


        {/* Right Side */}
        <Grid item xs={7} container justifyContent="center" alignItems="center">
          <img src={landingImage} alt="Pet Adoption" style={{ width: '70%', height: 'auto' }} />
        </Grid>
      </Grid>

      <img src={mockImage} alt="Mock" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto'}} />

      {/* News Article Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '800px',
          display: 'flex',
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
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Typography variant="h6">
            {isEditing ? 'Update Article' : 'Post a News Article'}
          </Typography>
        </Box>

        <TextField
          name="title"
          label="Title"
          variant="outlined"
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
          value={formData.title}
          onChange={handleChange}
          required
        />
        <TextField
          name="content"
          label="Content"
          variant="outlined"
          multiline
          rows={4}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
          value={formData.content}
          onChange={handleChange}
          required
        />
        <TextField
          name="author"
          label="Author"
          variant="outlined"
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
          value={formData.author}
          onChange={handleChange}
        />

        <Box sx={{ width: '100%', textAlign: 'left' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button
              variant="contained"
              component="span"
              color="primary"
              sx={{
                borderRadius: '8px',
                padding: '12px 24px',
              }}
            >
              Upload Image
            </Button>
          </label>

          {uploadedImage && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Attached Image:</Typography>
              <img
                src={uploadedImage}
                alt="Preview"
                style={{
                  width: '100%',
                  maxWidth: 300,
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
            </Box>
          )}
        </Box>

        <ToggleButton
          type="submit"
          sx={{
            border: '2px solid',
            borderRadius: '8px',
            padding: '12px 36px',
            borderColor: 'primary.main',
            backgroundColor: 'primary.main',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'white',
              color: 'primary.main',
            },
          }}
        >
          {isEditing ? 'Update' : 'Post'}
        </ToggleButton>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={successMessage}
        />



      {/* News Feed Cards */}
      <Typography variant="h4" sx={{ mb: 3 }}>Pet News</Typography>
      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.articleID}>
            <Card sx={{
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              transition: '0.3s',
              '&:hover': {
                boxShadow: 10, // Increase the shadow on hover for a "lift" effect
              }
            }}>
              {/* Thumbnail Image */}
              <Box
                sx={{
                  width: '100%',
                  height: 180,
                  backgroundImage: `url(${article.image || petPlaceholder})`, // Fallback to a placeholder image
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 1,
                }}
              />


              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  marginBottom: 1
                }}>
                  {article.title}
                </Typography>

                <Typography variant="body2" sx={{
                  color: 'text.secondary',
                  marginBottom: 1
                }}>
                  {article.content.length > 150 ? `${article.content.substring(0, 150)}...` : article.content}
                </Typography>

                <Typography variant="body2" sx={{
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  marginBottom: 1,
                  color: 'text.secondary'
                }}>
                  By {article.author}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{
                  fontSize: '0.85rem',
                  marginBottom: 2
                }}>
                  Posted on: {formatDate(article.createdAt)}
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Button
                    color="primary"
                    variant="outlined"
                    sx={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: '#fff'
                      }
                    }}
                    onClick={() => handleEdit(article)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    sx={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      '&:hover': {
                        backgroundColor: 'secondary.main',
                        color: '#fff'
                      }
                    }}
                    onClick={() => handleDeleteClick(article.articleID)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>


      {/* Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this article?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    maxWidth: 600,
    margin: '0 auto',
    backgroundColor: 'white',
    padding: 3,
    borderRadius: 2,
    boxShadow: 3,
  },
  textField: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
};

export default Home;
