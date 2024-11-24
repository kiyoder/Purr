package com.g1appdev.Hubbits.controller;

import com.g1appdev.Hubbits.entity.VolunteerOpportunity;
import com.g1appdev.Hubbits.service.VolunteerOpportunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/volunteer")
public class VolunteerOpportunityController {

    @Autowired
    private VolunteerOpportunityService service;

    // Get all opportunities
    @GetMapping("/opportunities")
    public ResponseEntity<List<VolunteerOpportunity>> viewOpportunities() {
        List<VolunteerOpportunity> opportunities = service.getAllOpportunities();
        return ResponseEntity.ok(opportunities);
    }

    // Get a single opportunity by ID
    @GetMapping("/opportunity/{id}")
    public ResponseEntity<VolunteerOpportunity> getOpportunityWithSignUps(@PathVariable int id) {
        Optional<VolunteerOpportunity> opportunity = service.getOpportunityById(id);
        return opportunity
                .map(ResponseEntity::ok)  // If the opportunity exists, return it with OK status
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());  // If not found, return NOT_FOUND
    }

    // Create a new opportunity
    @PostMapping("/opportunity")
    public VolunteerOpportunity createOpportunity(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("date") String date,
            @RequestParam("location") String location,
            @RequestParam("hoursWorked") int hoursWorked,
            @RequestParam("volunteersNeeded") int volunteersNeeded,
            @RequestParam(value = "volunteerImage", required = false) MultipartFile volunteerImage) {
    
        // Create the opportunity object
        VolunteerOpportunity opportunity = new VolunteerOpportunity();
        opportunity.setTitle(title);
        opportunity.setDescription(description);
        opportunity.setDate(date);
        opportunity.setLocation(location);
        opportunity.setHoursWorked(hoursWorked);
        opportunity.setVolunteersNeeded(volunteersNeeded);
    
        if (volunteerImage != null && !volunteerImage.isEmpty()) {
            try {
                // Upload image and set the URL (file path)
                String imageUrl = service.uploadImage(volunteerImage);
                opportunity.setVolunteerImageUrl(imageUrl);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    
        // Save the opportunity and return it
        return service.createOpportunity(opportunity, volunteerImage);
    }
    

    // Update an existing opportunity, including volunteerImageUrl
    @PutMapping("/opportunity/{id}")
    public ResponseEntity<VolunteerOpportunity> updateOpportunity(
            @PathVariable int id,
            @RequestPart("opportunity") VolunteerOpportunity opportunity,
            @RequestParam(value = "volunteerImage", required = false) MultipartFile volunteerImage) throws IOException {
        
        String volunteerImageUrl = null;
        if (volunteerImage != null && !volunteerImage.isEmpty()) {
            volunteerImageUrl = service.uploadImage(volunteerImage);
        }

        opportunity.setVolunteerImageUrl(volunteerImageUrl);
        try {
            VolunteerOpportunity updatedOpportunity = service.updateOpportunity(id, opportunity, volunteerImage);
            return ResponseEntity.ok(updatedOpportunity);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete an opportunity
    @DeleteMapping("/opportunity/{id}")
    public ResponseEntity<Void> deleteOpportunity(@PathVariable int id) {
        try {
            service.deleteOpportunity(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
