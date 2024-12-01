import React, { useState } from 'react';
import { Box, CssBaseline, Typography } from '@mui/material';
import UserDashboard from './UserDashboard';
import LostAndFoundDashboard from './LostAndFoundDashboard';
import AdminNavbar from './AdminNavbar';

const AdminDashboard = () => {
    const [selectedTab, setSelectedTab] = useState('Users');

    const renderContent = () => {
        switch (selectedTab) {
            case 'Users':
                return <UserDashboard />;
            case 'Lost and Found':
                return <LostAndFoundDashboard />;
            default:
                return <UserDashboard />;
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flex: 1 }}>
                <AdminNavbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        padding: 3,
                    }}
                >
                    <Typography variant="h4" align="center" sx={{ marginBottom: 2 }}>
                        {selectedTab} Dashboard
                    </Typography>
                    {renderContent()}
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
