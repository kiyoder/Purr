package com.g1appdev.Hubbits.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class VolunteerOpportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int opportunityID;

    private String title;
    private String description;
    private String date;
    private String location;
    
    // New fields for hours worked and volunteers needed
    private int hoursWorked;  // The number of hours a volunteer will work
    private int volunteersNeeded;  // The number of volunteers needed for the opportunity

    @OneToMany(mappedBy = "volunteerOpportunity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<VolunteerSignUp> volunteerSignUps;

    // New field for volunteer image URL
    private String volunteerImageUrl;  // The URL of the volunteer image (instead of byte array)

    // Getters and Setters

    public int getOpportunityID() {
        return opportunityID;
    }

    public void setOpportunityID(int opportunityID) {
        this.opportunityID = opportunityID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getHoursWorked() {
        return hoursWorked;
    }

    public void setHoursWorked(int hoursWorked) {
        this.hoursWorked = hoursWorked;
    }

    public int getVolunteersNeeded() {
        return volunteersNeeded;
    }

    public void setVolunteersNeeded(int volunteersNeeded) {
        this.volunteersNeeded = volunteersNeeded;
    }

    public List<VolunteerSignUp> getVolunteerSignUps() {
        return volunteerSignUps;
    }

    public void setVolunteerSignUps(List<VolunteerSignUp> volunteerSignUps) {
        this.volunteerSignUps = volunteerSignUps;
    }

    // Getter and Setter for volunteerImageUrl

    public String getVolunteerImageUrl() {
        return volunteerImageUrl;
    }

    public void setVolunteerImageUrl(String volunteerImageUrl) {
        this.volunteerImageUrl = volunteerImageUrl;
    }
}
