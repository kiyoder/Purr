import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Grid, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ToggleButton, IconButton } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import landingImage from '../assets/landing.png';
import mockImage from '../assets/mock.png';
import petPlaceholder from '../assets/petplaceholder.png';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Home = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    image: '',
  });

  const [uploadedImage, setUploadedImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/newsfeed');
      const updatedArticles = response.data.map((article) => ({
        ...article,
        image: article.imageUrl ? `http://localhost:8080${article.imageUrl}` : petPlaceholder,
      }));
      setArticles(updatedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('author', formData.author);
    data.append('publishedDate', formData.publishedDate);

    if (uploadedImage) {
      data.append('imagefile', uploadedImage);
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEditing && currentId) {
        await axios.put(`http://localhost:8080/api/newsfeed/${currentId}`, data, config);
        setSuccessMessage('Article updated successfully!');
      } else {
        await axios.post('http://localhost:8080/api/newsfeed', data, config);
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
    setFormData({
      title: article.title,
      content: article.content,
      author: article.author,
    });
    setUploadedImage(null); // Ensure the image is reset
    if (article.imageUrl) {
      setUploadedImage(article.imageUrl); // Assuming the image is a URL stored in the article
    }
    setIsEditing(true);
    setCurrentId(article.articleID); // Store the ID for the PUT request
  };

  const handleDeleteClick = (articleID) => {
    setDeleteId(articleID);  // Set the deleteId to the article's ID
    setDeleteDialogOpen(true); // Open the confirmation dialog
  };

  const confirmDelete = async () => {
    try {
      // Ensure that the deleteId is being passed correctly
      await axios.delete(`http://localhost:8080/api/newsfeed/${deleteId}`);
      // Remove the deleted article from the state
      setArticles(articles.filter((article) => article.articleID !== deleteId));
      setDeleteDialogOpen(false); // Close the delete dialog
    } catch (error) {
      console.error("Error deleting article:", error);
      setDeleteDialogOpen(false); // Close the dialog even if there's an error
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Top Page Layout */}
      <Grid container spacing={3} sx={{ padding: '50px' }}>
        <Grid item xs={5} container justifyContent="center" alignItems="center">
          <Typography variant="h3">Give a New Life to PURR</Typography>
          <Typography variant="h5">
            Pet adoption and rehoming are vital aspects of animal welfare, offering hope and a fresh start to pets in need.
            Open your heart and your home to a shelter pet.
          </Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <ToggleButton
              value="adopt"
              onClick={() => navigate('/adopt')}
              sx={{
                border: '2px solid',
                borderRadius: '8px',
                padding: '12px 36px',
                borderColor: 'primary.main',
                backgroundColor: 'primary.main',
                color: '#fff',
                '&:hover': { backgroundColor: 'white', color: 'primary.main' },
              }}
            >
              Adopt Now
            </ToggleButton>

            <ToggleButton
              value="rehome"
              onClick={() => navigate('/rehome')}
              sx={{
                border: '2px solid',
                borderRadius: '8px',
                padding: '12px 36px',
                borderColor: 'secondary.main',
                backgroundColor: 'secondary.main',
                color: '#fff',
                '&:hover': { backgroundColor: 'white', color: 'secondary.main' },
              }}
            >
              Rehome Now
            </ToggleButton>
          </Box>
        </Grid>

        <Grid item xs={7} container justifyContent="center" alignItems="center">
          <img src={landingImage} alt="Pet Adoption" style={{ width: '70%', height: 'auto' }} />
        </Grid>
      </Grid>

      <img src={mockImage} alt="Mock" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto' }} />

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
          padding: '20px',
          margin: '0 auto',
          gap: '16px',
          backgroundColor: '#F9F9F9',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6">{isEditing ? 'Update Article' : 'Post a News Article'}</Typography>
        <TextField
          name="title"
          label="Title"
          variant="outlined"
          fullWidth
          value={formData.title || ''}
          onChange={handleChange}
          required
        />
        <TextField
          name="content"
          label="Content"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={formData.content || ''}
          onChange={handleChange}
          required
        />
        <TextField
          name="author"
          label="Author"
          variant="outlined"
          fullWidth
          value={formData.author || ''}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button variant="contained" component="span" color="primary">
            Upload Image
          </Button>
        </label>
        {uploadedImage && (
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            {uploadedImage.name}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary">
          {isEditing ? 'Update' : 'Post'}
        </Button>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={successMessage} />

      {/* News Feed Cards */}
      <Typography variant="h4" sx={{ my: 3 }}>
        Pet News
      </Typography>
      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.articleID}>
            <Card sx={{ display: 'flex', flexDirection: 'column', position: 'relative', padding: 2, height: '100%' }}>
              <Box
                sx={{
                  width: '100%',
                  height: 180,
                  backgroundImage: `url(${article.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 1,
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{article.title || 'Untitled'}</Typography>
                <Typography variant="body2" sx={{ my: 1 }}>
                  {article.content.length > 100 ? `${article.content.substring(0, 100)}...` : article.content || 'No content available.'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {`By ${article.author || 'Unknown'} | Published: ${article.publishedDate ? formatDate(article.publishedDate) : 'N/A'}`}
                </Typography>
              </CardContent>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 1,
                  marginTop: 'auto',
                }}
              >
                {/* Learn More Button */}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => console.log("Learn More clicked for:", article.articleID)}
                >
                  Learn More
                </Button>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  {/* Update Button */}
                  <IconButton color="primary" onClick={() => handleEdit(article)}>
                    <EditIcon />
                  </IconButton>
                  {/* Delete Button */}
                  <IconButton color="primary" onClick={() => handleDeleteClick(article.articleID)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)} // Close dialog if the user clicks outside
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this article?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete} // Call the confirmDelete function when Confirm is clicked
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Home;
