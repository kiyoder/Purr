package com.g1appdev.Hubbits.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.g1appdev.Hubbits.entity.PetEntity;
import com.g1appdev.Hubbits.entity.PetSponsorshipEntity;
import com.g1appdev.Hubbits.repository.PetRepository;
import com.g1appdev.Hubbits.repository.PetSponsorshipRepository;

@Service
public class PetSponsorshipService {
    @Autowired
    PetSponsorshipRepository psrepo;
    @Autowired
    PetRepository prepo;


    public PetSponsorshipService(){
        super();
    }

    //add record
    public PetSponsorshipEntity postPetSponsorRecord(PetSponsorshipEntity petSponsor, int petId) {
        if (petSponsor == null) {
            throw new IllegalArgumentException("PetSponsorshipEntity cannot be null");
        }
        Optional<PetEntity> petOptional = prepo.findById(petId);
        if (!petOptional.isPresent()) {
            throw new IllegalArgumentException("Pet with ID " + petId + " not found.");
        }
        PetEntity pet = petOptional.get();
        petSponsor.setPet(pet); // Assuming `pet` is a field in `PetSponsorshipEntity`
        return psrepo.save(petSponsor);
    }

    //get all records
    public List<PetSponsorshipEntity> getAllPetSponsors(){
        return psrepo.findAll();
    }

    //get by its ID
    public PetSponsorshipEntity getPetSponsor(int psid) {
        Optional<PetSponsorshipEntity> petSponsorship = psrepo.findById(psid);  // This should return Optional<PetSponsorshipEntity>
        return petSponsorship.orElse(null);  // Ensure this is Optional<PetSponsorshipEntity>
    }
    
    //get by its pet ID
    public PetSponsorshipEntity getPetSponsorByPetId(int petId) {
        Optional<PetEntity> pet = prepo.findById(petId);  // Find pet by ID
        if (pet.isPresent()) {
            return pet.get().getPetSponsor();  // Return the associated PetSponsorshipEntity
        } else {
            throw new RuntimeException("No pet found with id: " + petId);
        }
    }
    //update a record
    public PetSponsorshipEntity putPetSponsorDetails(int psid, PetSponsorshipEntity petSponsor, int petId, double increment) {
        // Find existing sponsorship
        PetSponsorshipEntity existingSponsor = psrepo.findById(psid)
                .orElseThrow(() -> new RuntimeException("Sponsorship not found with ID: " + psid));
    
        // Find associated pet
        PetEntity pet = prepo.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found with ID: " + petId));
    
        // Update fields from the request
        existingSponsor.setAmount(petSponsor.getAmount());
        existingSponsor.setSponsorshipDate(petSponsor.getSponsorshipDate());
        existingSponsor.setPet(pet);
    
        // Increment amountGained
        existingSponsor.addAmountGained(increment);
    
        // Check if sponsorship is complete
        if (existingSponsor.isSponsorshipComplete()) {
            System.out.println("Sponsorship for Pet ID " + petId + " is complete.");
            // Add any additional completion logic here
        }
    
        // Save and return the updated sponsorship
        return psrepo.save(existingSponsor);
    }

    //delete a record
    public String deletePetSponsor(int psid){
        String msg = "";
        if(psrepo.findById(psid) != null){
            psrepo.deleteById(psid);
            msg = "Pet Sponsor deleted Successfully!";
        }else{
            msg = psid + " not found!";
        }
        return msg;
    }
}
