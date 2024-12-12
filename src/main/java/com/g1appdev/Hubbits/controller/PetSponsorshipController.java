package com.g1appdev.Hubbits.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import com.g1appdev.Hubbits.entity.PetSponsorshipEntity;
import com.g1appdev.Hubbits.service.PetSponsorshipService;

@RestController
@RequestMapping(method = RequestMethod.GET, path = "/api/petSponsor")
public class PetSponsorshipController {
    @Autowired
    PetSponsorshipService psserv;
    
    @GetMapping("/test")
    public String print(){
        return "This is the pet sponsor controller";
    }

    @PostMapping("/postPetSponsorRecord")
    public PetSponsorshipEntity postPetSponsorRecord(@RequestBody PetSponsorshipEntity petSponsor, @RequestParam int petId) {
        return psserv.postPetSponsorRecord(petSponsor, petId);
    }

    @GetMapping("/getAllPetSponsors")
    public List<PetSponsorshipEntity> getAllPetSponsors(){
        return psserv.getAllPetSponsors();
    }

    @GetMapping("/getPetSponsor/{psid}")
    public PetSponsorshipEntity getPetSponsor(@PathVariable int psid) {
        return psserv.getPetSponsor(psid);  // Return the Optional directly
    }
    

    @PutMapping("/putPetSponsorDetails")
public PetSponsorshipEntity putPetSponsorDetails(@RequestParam int psid, @RequestBody PetSponsorshipEntity petSponsor, @RequestParam int petId, @RequestParam double increment) {
        return psserv.putPetSponsorDetails(psid, petSponsor, petId, increment);
    }

    @DeleteMapping("/deletePetSponsorDetails/{psid}")
    public String deletePetSponsor(@PathVariable int psid){
        return psserv.deletePetSponsor(psid);
    }

}
