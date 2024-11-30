import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Container
} from '@mui/material';

const LostAndFoundDashboard = () => {
    const [reports, setReports] = useState([]); // Stores all reports
    const [editingReportId, setEditingReportId] = useState(null); // ID of the row being edited
    const [editFormData, setEditFormData] = useState({}); // Data for the editable row

    useEffect(() => {
        fetchReports();
    }, []);

    // Fetch reports from API
    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/lostandfound');
            console.log('Fetched Reports:', response.data); // Log the fetched data
            setReports(response.data); // Set fetched reports
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    // Enter edit mode for a specific row
    const handleEdit = (report) => {
        console.log('Editing Report:', report); // Log the report being edited
        setEditingReportId(report.id); // Set editingReportId to the selected row's ID
        setEditFormData({ ...report }); // Initialize editFormData with the row's data
    };

    // Cancel edit mode
    const handleCancelEdit = () => {
        console.log('Canceling Edit Mode');
        setEditingReportId(null); // Clear editingReportId
        setEditFormData({}); // Reset editFormData
    };

    // Update form data as fields change
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        console.log('Changing Field:', name, 'Value:', value); // Log field changes
        setEditFormData((prev) => ({
            ...prev,
            [name]: value // Update the specific field
        }));
    };

    // Save the edited row
    const handleSaveEdit = async (id) => {
        console.log('Saving Report:', editFormData); // Log the form data being saved
        try {
            const response = await axios.put(
                `http://localhost:8080/api/lostandfound/${id}`,
                editFormData
            );
            if (response.status === 200) {
                console.log('Report updated successfully');
                fetchReports(); // Refresh the data
                setEditingReportId(null); // Exit edit mode
            } else {
                console.error('Failed to update report');
            }
        } catch (error) {
            console.error('Error saving report:', error);
        }
    };

    // Delete a specific row
    const handleDelete = async (id) => {
        console.log('Deleting Report ID:', id); // Log the ID of the report being deleted
        try {
            const response = await axios.delete(`http://localhost:8080/api/lostandfound/${id}`);
            if (response.status === 200) {
                alert('Report deleted successfully');
                fetchReports(); // Refresh the data
            } else {
                console.error('Failed to delete report');
            }
        } catch (error) {
            console.error('Error deleting report:', error);
        }
    };

    return (
        <Container>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Report Type</TableCell>
                            <TableCell>Date Reported</TableCell>
                            <TableCell>Last Seen</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Creator ID</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map((report) => {
                            console.log('Rendering Report ID:', report.id); // Log each row being rendered
                            return (
                                <TableRow key={report.id}>
                                    {/* Render fields conditionally */}
                                    <TableCell>
                                        {editingReportId === report.id ? (
                                            <TextField
                                                name="reporttype"
                                                value={editFormData.reporttype || ''}
                                                onChange={handleEditChange}
                                                fullWidth
                                            />
                                        ) : (
                                            report.reporttype
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingReportId === report.id ? (
                                            <TextField
                                                name="datereported"
                                                value={editFormData.datereported || ''}
                                                onChange={handleEditChange}
                                                fullWidth
                                            />
                                        ) : (
                                            report.datereported
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingReportId === report.id ? (
                                            <TextField
                                                name="lastseen"
                                                value={editFormData.lastseen || ''}
                                                onChange={handleEditChange}
                                                fullWidth
                                            />
                                        ) : (
                                            report.lastseen
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingReportId === report.id ? (
                                            <TextField
                                                name="description"
                                                value={editFormData.description || ''}
                                                onChange={handleEditChange}
                                                fullWidth
                                            />
                                        ) : (
                                            report.description
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingReportId === report.id ? (
                                            <TextField
                                                name="creatorid"
                                                value={editFormData.creatorid || ''}
                                                onChange={handleEditChange}
                                                fullWidth
                                            />
                                        ) : (
                                            report.creatorid
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingReportId === report.id ? (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleSaveEdit(report.id)}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={handleCancelEdit}
                                                    style={{ marginLeft: '8px' }}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleEdit(report)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleDelete(report.id)}
                                                    style={{ marginLeft: '8px' }}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default LostAndFoundDashboard;
