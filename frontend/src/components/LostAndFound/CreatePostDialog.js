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
import axios from "axios";

const CreatePostDialog = ({
  open,
  setOpen,
  fetchLostItems,
  postToEdit,
  isEditing,
}) => {
  const [formData, setFormData] = useState({
    reportType: "lost",
    dateReported: "",
    lastSeen: "",
    description: "",
    imageData: null,
  });

  useEffect(() => {
    if (isEditing && postToEdit) {
      setFormData({
        reportType: postToEdit.reportType || "",
        petCategory: postToEdit.petCategory || "",
        dateReported: postToEdit.dateReported || "",
        lastSeen: postToEdit.lastSeen || "",
        description: postToEdit.description || "",
        imageData: postToEdit.imageFile || null,
      });
    } else {
      setFormData({
        reportType: "lost",
        petCategory: "",
        dateReported: "",
        lastSeen: "",
        description: "",
        imageData: null,
      });
    }
  }, [isEditing, postToEdit, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, imageData: e.target.files[0] });
  };

  const handleReportTypeChange = (event, newReportType) => {
    if (newReportType) {
      setFormData({ ...formData, reportType: newReportType });
    }
  };

  const handleSubmit = async (e) => {
    if (isEditing) {
      const confirmed = window.confirm(
        "Are you sure you want to update this post?"
      );
      if (!confirmed) {
        return;
      }
    }
    e.preventDefault();

    const dataToSubmit = new FormData();
    dataToSubmit.append("reportType", formData.reportType);
    dataToSubmit.append("petCategory", formData.petCategory);
    dataToSubmit.append("dateReported", formData.dateReported);
    dataToSubmit.append("lastSeen", formData.lastSeen);
    dataToSubmit.append("description", formData.description);

    if (formData.imageData) {
      dataToSubmit.append("imageFile", formData.imageData);
    }

    try {
      let response;
      if (isEditing) {
        response = await axios.put(
          `http://localhost:8080/api/lostandfound/${postToEdit.reportID}`,
          dataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Report updated:", response.data);
      } else {
        response = await axios.post(
          `http://localhost:8080/api/lostandfound`,
          dataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Report created:", response.data);
      }

      fetchLostItems();
      setOpen(false);
    } catch (error) {
      console.error("Error updating report:", error);
      alert(
        "Error updating report: " +
          (error.response?.data?.message || error.message)
      );
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
            value={formData.reportType}
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
                  formData.reportType === "lost" ? "primary.main" : "grey.500",
                color: formData.reportType === "lost" ? "#fff" : "grey.500",
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
                    formData.reportType === "lost"
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
                  formData.reportType === "found" ? "primary.main" : "grey.500",
                color: formData.reportType === "found" ? "#fff" : "grey.500",
                backgroundColor:
                  formData.reportType === "found"
                    ? "primary.main"
                    : "transparent",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "#fff",
                },
                "&:hover": {
                  backgroundColor:
                    formData.reportType === "found"
                      ? "primary.dark"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Found
            </ToggleButton>
          </ToggleButtonGroup>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="petCategory"
                label="Pet Type"
                fullWidth
                value={formData.petCategory}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="dateReported"
                label="Date Reported"
                type="date"
                fullWidth
                value={formData.dateReported}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="lastSeen"
                label="Last Seen"
                fullWidth
                value={formData.lastSeen}
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
              {!isEditing && (
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  required
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <ToggleButton
                    onclick={handleSubmit}
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
