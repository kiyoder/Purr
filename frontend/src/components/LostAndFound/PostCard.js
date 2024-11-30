import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Stack,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const PostCard = ({ item, fetchLostItems, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Admin role check
  const [creatorUsername, setCreatorUsername] = useState("Unknown");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Fetch the creator's username
    const fetchCreatorUsername = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${item.creatorid}`);
        if (response.status === 200) {
          setCreatorUsername(response.data.username);
        } else {
          setCreatorUsername("Unknown");
        }
      } catch (error) {
        console.error("Error fetching creator's details:", error);
        setCreatorUsername("Unknown");
      }
    };

    fetchCreatorUsername();
  }, [item.creatorid]);

  useEffect(() => {
    // Retrieve user details from local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserId(storedUser.userId);
      setIsAdmin(storedUser.role === "ROLE_ADMIN"); // Check if user is an admin
    } else {
      console.error("User details not found in local storage.");
    }
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/lostandfound/${item.reportid}`);
      alert("Item deleted successfully");
      fetchLostItems();
      setOpenDialog(false); // Close the confirmation dialog after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
      setOpenDialog(false); // Close dialog even if there's an error
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true); // Open the dialog when the delete button is clicked
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog without deleting
  };

  const handleEdit = () => {
    onEdit(item);
  };

  return (
    <Card sx={{ height: 520, display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        alt={item.description}
        height="200"
        image={
          item.imageurl
            ? `http://localhost:8080${item.imageurl}`
            : "http://localhost:8080/images/default_image.jpg"
        }
        title={item.description}
      />

      <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={item.reporttype === "lost" ? "Lost" : "Found"}
            variant="outlined"
            color="primary"
            sx={{
              fontWeight: "bold",
              borderWidth: 1.5,
              borderColor: "primary.main",
            }}
          />
          <Chip
            label={item.petcategory}
            variant="outlined"
            color="primary"
            sx={{
              fontWeight: "bold",
              borderWidth: 1.5,
              borderColor: "primary.main",
            }}
          />
        </Stack>
        <Typography color="primary" fontSize="12px">
          Last Seen
        </Typography>
        <Typography color="secondary" fontWeight="bold" sx={{ ml: 2 }}>
          {item.lastseen}
        </Typography>
        <Typography color="primary" fontSize="12px">
          Date Reported
        </Typography>
        <Typography color="secondary" fontWeight="bold" sx={{ ml: 2 }}>
          {item.datereported}
        </Typography>
        <br />
        <Typography
          color="primary"
          fontStyle="italic"
          sx={{
            whiteSpace: "normal",
            overflowWrap: "break-word",
          }}
        >
          {item.description}
        </Typography>
        <br />
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography color="primary" fontSize="14px">
            Posted by
          </Typography>
          <Typography color="secondary" fontWeight="bold" sx={{ whiteSpace: "nowrap" }}>
            {creatorUsername}
          </Typography>
        </Stack>
      </CardContent>

      {/* Show edit and delete buttons for the creator or admin */}
      {(parseInt(userId) === item.creatorid || isAdmin) && (
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px" }}>
          <IconButton color="primary" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={handleOpenDialog}
            disabled={isDeleting}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
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
            color="error"
            align="center"
            sx={{ fontWeight: "bold", fontFamily: "'Caramel', sans-serif" }}
          >
            Delete Post
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: "white",
            borderTop: "1px solid",
            borderColor: "primary.main",
            borderRadius: "0 0 16px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <Typography color="error" fontSize="18px" fontWeight="bold" sx={{ whiteSpace: "nowrap" }}>
            Are you sure you want to delete this post?
          </Typography>
          <Typography color="error" fontSize="18px">
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PostCard;
