import React, { useState } from "react";
import { TextField, Button, Snackbar, Select, MenuItem, InputLabel, FormControl, Typography } from "@mui/material";

const RehomeForm = ({ onNewRehome }) => {
    const [formData, setFormData] = useState({
        petType: "",
        breed: "",
        image: null, // Correct for file handling
        description: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: URL.createObjectURL(file) }); // Store image preview URL
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.petType || !formData.breed || !formData.image || !formData.description) {
            setErrorMessage("All fields are required. Please fill out all fields.");
            return;
        }

        const newRehome = {
            id: Date.now(),
            petType: formData.petType,
            breed: formData.breed,
            image: formData.image,
            description: formData.description,
            status: "PENDING_REHOME",
        };

        // Pass data to parent
        onNewRehome(newRehome);

        setSuccessMessage("Rehome form submitted successfully!");
        resetForm();

        setTimeout(() => {
            setSuccessMessage("");
        }, 2000);
    };

    const resetForm = () => {
        setFormData({
            petType: "",
            breed: "",
            image: null,
            description: "",
        });
        setErrorMessage("");
    };

    const handleSnackbarClose = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    return (
        <div style={styles.container}>
            <Typography
                variant="h4"
                sx={{
                    color: "#5A20A8",
                    marginBottom: 2,
                    fontFamily: "'Caramel', sans-serif",
                    fontWeight: "bold",
                }}
            >
                Rehome Form
            </Typography>
            <form onSubmit={handleSubmit}>
                <FormControl variant="outlined" fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="pet-type-label">Type of Pet</InputLabel>
                    <Select
                        labelId="pet-type-label"
                        name="petType"
                        value={formData.petType}
                        onChange={handleChange}
                        label="Type of Pet"
                        required
                    >
                        <MenuItem value="Dog">Dog</MenuItem>
                        <MenuItem value="Bird">Bird</MenuItem>
                        <MenuItem value="Cat">Cat</MenuItem>
                        <MenuItem value="Hamster">Hamster</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Breed of Pet"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    required
                />

                <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
                    Upload Image
                    <input type="file" accept="image/*" hidden onChange={handleFileChange} required />
                </Button>

                <TextField
                    label="Pet Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    required
                />

                <Button
                    variant="contained"
                    type="submit"
                    sx={{
                        backgroundColor: "#5A20A8",
                        color: "white",
                        "&:disabled": {
                            backgroundColor: "#ccc",
                            color: "#666",
                        },
                    }}
                >
                    Confirm Rehome
                </Button>
            </form>
            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleSnackbarClose} message={successMessage} />
            <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={handleSnackbarClose} message={errorMessage} />
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
        margin: "0 auto",
        maxWidth: "600px",
    },
};

export default RehomeForm;
