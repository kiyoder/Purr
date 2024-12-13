package com.g1appdev.Hubbits.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    
    //update a record
    @SuppressWarnings("finally")
    public PetSponsorshipEntity putPetSponsorDetails(int psid, PetSponsorshipEntity petSponsorNDetails) {
        // Find existing sponsorship
        PetSponsorshipEntity existingSponsor = psrepo.findById(psid)
                .orElseThrow(() -> new RuntimeException("Sponsorship not found with ID: " + psid));
        try{
            existingSponsor = psrepo.findById(psid).get();

            existingSponsor.setAmount(petSponsorNDetails.getAmount());
            existingSponsor.setExpiryDate(petSponsorNDetails.getExpiryDate());
            existingSponsor.setAmountGained(petSponsorNDetails.getAmountGained());
        }catch(IllegalArgumentException nex){
            System.out.println("Error updating sponsorship");
        }finally{
            return psrepo.save(existingSponsor);
        }
    }

    public PetSponsorshipEntity addAmountToSponsor(int psid, double amount) {
        // Retrieve the sponsorship record by its ID
        PetSponsorshipEntity sponsorship = psrepo.findById(psid)
                .orElseThrow(() -> new RuntimeException("Sponsorship not found with ID: " + psid));

        // Add the inputted amount to the amountGained
        sponsorship.addAmountGained(amount);

        // Save the updated sponsorship record
        return psrepo.save(sponsorship);
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
