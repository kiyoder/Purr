import React from "react";
import {
  Card,
  Box,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const PostCard = ({ item, fetchLostItems, onEdit }) => {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the post?"
    );
    if (!confirmed) return;

    try {
      if (item?.reportID) {
        await axios.delete(
          `http://localhost:8080/api/lostandfound/${item.reportID}`
        );
        alert("Item deleted successfully");
        fetchLostItems();
      } else {
        alert("Item ID is not defined");
      }
    } catch (error) {
      alert(
        "Failed to delete item: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleEdit = () => {
    onEdit(item);
  };

  const imageSrc = item.image
    ? `data:image/png;base64,${btoa(
        new Uint8Array(item.image).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`
    : null;

  return (
    <Card sx={{ height: 400, display: "flex", flexDirection: "column" }}>
      {imageSrc ? (
        <CardMedia
          component="img"
          height="140"
          image={imageSrc}
          alt="Post image"
          sx={{ objectFit: "cover" }}
        />
      ) : (
        <Box
          sx={{
            height: 140,
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No Image Available
          </Typography>
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={item.reportType === "lost" ? "Lost" : "Found"}
            variant="outlined"
            color="primary"
            sx={{
              fontWeight: "bold",
              borderWidth: 1.5,
              borderColor: "primary.main",
            }}
          />
          <Chip
            label={item.petCategory}
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
          {item.lastSeen}
        </Typography>
        <Typography color="primary" fontSize="12px">
          Date Reported
        </Typography>
        <Typography color="secondary" fontWeight="bold" sx={{ ml: 2 }}>
          {item.dateReported}
        </Typography>
        <br />
        <Typography color="primary" fontStyle="italic" noWrap>
          {item.description}
        </Typography>
      </CardContent>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "8px",
        }}
      >
        <IconButton color="primary" onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton color="primary" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Card>
  );
};

export default PostCard;
