import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";

import axios from "axios";

const CreatePostDialog = ({
  open,
  setOpen,
  fetchLostItems,
  postToEdit,
  isEditing,
}) => {
  const [formData, setFormData] = useState({
    reporttype: "lost",
    datereported: "",
    lastseen: "",
    description: "",
    imagedata: null,
  });

  const [previewImage, setPreviewImage] = useState(null); // Move this inside the component
  const [userId, setUserId] = useState(null); // Store the authenticated user's ID

  useEffect(() => {
    // Retrieve user ID from local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.userId) {
      setUserId(storedUser.userId);
    } else {
      console.error("User ID not found in local storage.");
    }
  }, []);

  useEffect(() => {
  if (isEditing && postToEdit) {
    setFormData({
      reporttype: postToEdit.reporttype || "lost",
      petcategory: postToEdit.petcategory || "",
      datereported: postToEdit.datereported || "",
      lastseen: postToEdit.lastseen || "",
      description: postToEdit.description || "",
      imagedata: postToEdit.imagefile || null,
    });

    if (postToEdit.imagefile) {
      const previewUrl = URL.createObjectURL(postToEdit.imagefile);
      setPreviewImage(previewUrl);
    }
  } else {
    setFormData({
      reporttype: "lost",
      petcategory: "",
      datereported: "",
      lastseen: "",
      description: "",
      imagedata: null,
    });
    setPreviewImage(null);
  }
}, [isEditing, postToEdit, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    setFormData({ ...formData, imagedata: file });
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  } else {
    alert("Please upload a valid image file.");
  }
};


  const handleReportTypeChange = (event, newReportType) => {
    if (newReportType) {
      setFormData({ ...formData, reporttype: newReportType });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("You must be logged in to create or edit a post.");
      return;
    }

    const token = localStorage.getItem("token"); // Ensure token exists
    if (!token) {
      console.error("JWT token not found");
      alert("Please log in to submit a post.");
      return;
    }

    const dataToSubmit = new FormData();
    dataToSubmit.append("reporttype", formData.reporttype || "lost");
    dataToSubmit.append("petcategory", formData.petcategory);
    dataToSubmit.append("datereported", formData.datereported);
    dataToSubmit.append("lastseen", formData.lastseen);
    dataToSubmit.append("description", formData.description);
    dataToSubmit.append("creatorid", userId);

    if (formData.imagedata) {
      dataToSubmit.append("imagefile", formData.imagedata);
    }

    try {
      const url = isEditing
        ? `http://localhost:8080/api/lostandfound/${postToEdit.reportid}`
        : `http://localhost:8080/api/lostandfound`;

      const method = isEditing ? "put" : "post";
      const response = await axios[method](url, dataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(isEditing ? "Report updated" : "Report created", response.data);
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);

      const errorDetails = error.response?.data
        ? JSON.stringify(error.response.data, null, 2)
        : error.message;

      alert(`Failed to submit the post. Server response:\n${errorDetails}`);
    }
  };



  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "white",
          border: "2px solid",
          borderColor: "primary.main",
          borderRadius: "16px",
          boxShadow: "none",
        },
        "& .MuiDialog-container": {
          backdropFilter: "blur(3px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <DialogTitle>
        <Typography
          variant="h4"
          component="div"
          color="primary"
          align="center"
          sx={{ fontWeight: "bold", fontFamily: "'Caramel', sans-serif" }}
        >
          {isEditing ? "Edit Post" : "Create Post"}
        </Typography>
        <CloseIcon
          onClick={() => setOpen(false)}
          style={{
            cursor: "pointer",
            position: "absolute",
            right: 16,
            top: 16,
          }}
        />
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: "white",
          borderTop: "1px solid",
          borderColor: "primary.main",
          borderRadius: "0 0 16px 16px",
          padding: "24px",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <ToggleButtonGroup
            value={formData.reporttype || "lost"}
            exclusive
            onChange={handleReportTypeChange}
            aria-label="Report Type"
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
              mt: 2,
            }}
          >
            <ToggleButton
              value="lost"
              aria-label="Lost"
              sx={{
                border: "2px solid",
                borderRadius: "8px",
                padding: "12px 36px",
                borderColor:
                  formData.reporttype === "lost" ? "primary.main" : "grey.500",
                color: formData.reporttype === "lost" ? "#fff" : "grey.500",
                backgroundColor:
                  formData.reportType === "lost"
                    ? "primary.main"
                    : "transparent",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "#fff",
                },
                "&:hover": {
                  backgroundColor:
                    formData.reporttype === "lost"
                      ? "primary.dark"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Lost
            </ToggleButton>
            <ToggleButton
              value="found"
              aria-label="Found"
              sx={{
                border: "2px solid",
                borderRadius: "8px",
                padding: "12px 36px",
                borderColor:
                  formData.reporttype === "found" ? "primary.main" : "grey.500",
                color: formData.reporttype === "found" ? "#fff" : "grey.500",
                backgroundColor:
                  formData.reporttype === "found"
                    ? "primary.main"
                    : "transparent",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "#fff",
                },
                "&:hover": {
                  backgroundColor:
                    formData.reporttype === "found"
                      ? "primary.dark"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Found
            </ToggleButton>
          </ToggleButtonGroup>
          {/* Form Fields */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="petcategory"
                label="Pet Type"
                fullWidth
                value={formData.petcategory}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="datereported"
                label="Date Reported"
                type="date"
                fullWidth
                value={formData.datereported}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" style={{ color: "#675BC8" }}>
                      {/* Calendar icon styling */}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="lastseen"
                label="Last Seen"
                fullWidth
                value={formData.lastseen}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={formData.description}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Upload Image:</Typography>
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
              />
              {previewImage && (
                <Box mt={2}>
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <ToggleButton
                    onClick={handleSubmit}
                    sx={{
                      border: "2px solid",
                      borderRadius: "8px",
                      padding: "12px 36px",
                      borderColor: "primary.main",
                      backgroundColor: "primary.main",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "white",
                        color: "primary.main",
                      },
                    }}
                  >
                    Submit
                  </ToggleButton>
                </Box>
              </Grid>
            </Grid>
            
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;

