import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import UserDashboard from "./components/Dashboards/UserDashboard";
import Home from "./components/Home";
import LostAndFound from "./components/LostAndFound";
import Sponsor from "./components/Sponsor";
import DonationForm from "./components/DonationForm";
import DonationTable from "./components/Dashboards/DonationTable";


import VolunteerSignUp from "./components/Volunteer/VolunteerSignUpList";
import CreateOpportunity from "./components/Volunteer/CreateOpportunity";
import Volunteer from "./components/Volunteer/Volunteer";
import VolunteerDashboard from "./components/Volunteer/VolunteerDashboard";
import OpportunityDetail from "./components/Volunteer/OpportunityDetail";
import UpdateOpportunity from "./components/Volunteer/UpdateOpportunity";
import AboutUs from "./components/AboutUs";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import NoMatch from "./components/NoMatch";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import PetList from "./components/PetRehome/PetList";
import AdminDashboard from "./components/Dashboards/AdminDashboard";
import { UserProvider } from "./components/UserContext";
import ArticleDashboard from "./components/Dashboards/ArticleDashboard";
import User from "./components/User";



const theme = createTheme({
  palette: {
    primary: {
      main: "#675BC8",
    },
    mode: "light", 
  },
  components: {
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: "#675BC8",
        },
      },
    },
  },
});


function App() {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <div
            style={{
              paddingTop: "120px", 
            }}
          ></div>
          <Navbar />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<UserDashboard />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} /> {/* Default to login */}
            <Route path="/home" element={<Home />} />
            <Route path="/article_dash" element={<ArticleDashboard />} />
            <Route path="/lost-and-found" element={<LostAndFound />} />
            <Route path="/sponsor" element={<Sponsor />} />
            <Route path="/adopt" element={<PetList />} />
            <Route path="*" element={<NoMatch />} />
            <Route path="/donate" element={<DonationForm />} />

            <Route path="/about-us" element={<AboutUs/>} />

            <Route path="/donation_dash" element={<DonationTable />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/admin/manage-opportunities" element={<VolunteerDashboard />}/>
            <Route path="/admin/manage-volunteers" element={<VolunteerSignUp />}/>
            <Route path="/opportunity/:id" element={<OpportunityDetail />} />
            <Route path="/update-opportunity/:id" element={<UpdateOpportunity />} />
            <Route path="/book" element={<CreateOpportunity />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/user/:id" element={<User />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
