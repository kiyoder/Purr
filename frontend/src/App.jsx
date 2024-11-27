// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { Route, Routes, Router } from "react-router-dom";

import { Box } from "@mui/material";
import Home from "./components/Home";
import LostAndFound from "./components/LostAndFound";
import Sponsor from "./components/Sponsor";
import PetList from "./components/PetList"
import Login from "./components/Login";

import Volunteer from "./components/Volunteer";
import VolunteerOpportunities from "./components/Volunteer/VolunteerOpportunities"
import OpportunityDetail from "./components/Volunteer/OpportunityDetail";
import VolunteerSignUp from "./components/Volunteer/VolunteerSignUpList";

import CreateOpportunity from "./components/Volunteer/CreateOpportunity";
import AppMenu from "./components/AppMenu";
import Menu from "./components/Menu";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
  return (
    <div>
      <Menu /> {/* Add the Menu component here */}
      <Box sx={{ mt: 8 }}>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/lost-and-found" element={<LostAndFound />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="/adoption" element={<PetList />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/manage-opportunities" element={<VolunteerOpportunities />} />
          <Route path="/admin/manage-volunteers" element={<VolunteerSignUp />} />
          <Route path="/opportunity/:id" element={<OpportunityDetail />} />
          <Route path="/book" element={<CreateOpportunity />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Box>
    </div>
  );
};

export default App;
