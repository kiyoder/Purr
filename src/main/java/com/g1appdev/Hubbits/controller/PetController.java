package com.g1appdev.Hubbits.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.g1appdev.Hubbits.entity.PetEntity;
import com.g1appdev.Hubbits.entity.PetSponsorshipEntity;
import com.g1appdev.Hubbits.service.PetService;

@RestController
@RequestMapping(method = RequestMethod.GET, path = "/api/pet")
public class PetController {
    @Autowired
    PetService pserv;

    @GetMapping("/test")
    public String print(){
        return "Hello, John Edward Selma";
    }

    @PostMapping("/postpetrecord")
    public PetEntity postPetRecord(@RequestBody PetEntity pet){
        return pserv.postPetRecord(pet);
    }

    @GetMapping("/getAllPets")
    public List<PetEntity> getAllPets(){
        return pserv.getAllPets();
    }

    @GetMapping("/getPet/{id}")
    public PetEntity getPetById(@PathVariable int id) {
        return pserv.getPetById(id);
    }

    @GetMapping("/getPetSponsorByPet/{petId}")
    public ResponseEntity<PetEntity> getPetSponsorByPetId(@PathVariable int petId) {
        PetEntity pet = pserv.getPetSponsorByPetId(petId);
        return ResponseEntity.ok(pet);  // Return the PetEntity, which includes petSponsorId
    }


    @PutMapping("/putPetDetails")
    public PetEntity putPetDetails(@RequestParam int pid, @RequestBody PetEntity newPetDetails){
        return pserv.putPetDetails(pid, newPetDetails);
    }

    @DeleteMapping("/deletePetDetails/{pid}")
    public String deletePet(@PathVariable int pid){
        return pserv.deletePet(pid);
    }

}
