// src/App.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./components/Home";
import LostAndFound from "./components/LostAndFound";
import Sponsor from "./components/Sponsor";
import Adoption from "./components/Adoption";
import Volunteer from "./components/Volunteer";
import Login from "./components/Login";
import VolunteerOpportunities from "./components/VolunteerOpportunities";
import OpportunityDetail from "./components/OpportunityDetail"; // Ensure this import is present
import NoMatch from "./components/NoMatch";
import AppMenu from "./components/AppMenu";
import VolunteerSignUp from "./components/VolunteerSignUpList";
import CreateOpportunity from "./components/CreateOpportunity";
import Menu from "./components/Menu";

const App = () => {
  return (
    <div>
      <Menu /> {/* Add the Menu component here */}
      <Box sx={{ mt: 8 }}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/lost-and-found" element={<LostAndFound />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="/adoption" element={<Adoption />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/manage-opportunities" element={<VolunteerOpportunities />} />
          <Route path="/admin/manage-volunteers" element={<VolunteerSignUp />} />
          <Route path="/opportunity/:id" element={<OpportunityDetail />} /> {/* Ensure this is correct */}
          <Route path="/book" element={<CreateOpportunity />} />
          <Route path="*" element={<NoMatch />} /> {/* Fallback route for unmatched paths */}
        </Routes>
      </Box>
    </div>
  );
};

export default App;