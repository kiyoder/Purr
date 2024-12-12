package com.g1appdev.Hubbits.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "pets")
public class PetEntity{
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pid;

    private String name;
    private String type;
    private String breed;
    private int age;
    private String gender;
    private String description;
    private String photo;
    private String status;
    private boolean allowSponsorship;

    @OneToOne(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private PetSponsorshipEntity pSE;

    public PetEntity(){
        super();
    }
    
    public PetEntity(int pid, String name,String type, String breed, int age, String gender, String description, String photo, String status, boolean allowSponsorship, PetSponsorshipEntity pSE){
        super();
        this.pid = pid;
        this.name = name;
        this.type = type;
        this.age = age;
        this.gender = gender;
        this.description = description;
        this.photo = photo;
        this.status = status;
        this.allowSponsorship = allowSponsorship;
        this.pSE = pSE;
    }

    public int getPid(){
        return pid;
    } 

    public void setPid(int pid){
        this.pid = pid;
    }

    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name = name;
    }

    public String getType(){
        return type;
    }

    public void setType(String type){
        this.type = type;
    }

    public String getBreed(){
        return breed;
    }

    public void setBreed(String breed){
        this.breed = breed;
    }

    public int getAge(){
        return age;
    }

    public void setAge(int age){
        this.age = age;
    }

    public String getGender(){
        return gender;
    }

    public void setGender(String gender){
        this.gender = gender;
    }

    public String getDescription(){
        return description;
    }

    public void setDescription(String description){
        this.description = description;
    }

    public String getPhoto(){
        return photo;
    }

    public void setPhoto(String photo){
        this.photo = photo;
    }

    public String getStatus(){
        return status;
    }

    public void setStatus(String status){
        this.status = status;
    }

    public boolean getAllowSponsorship(){
        return allowSponsorship;
    }

    public void setAllowSponsorship(boolean allowSponsorship){
        this.allowSponsorship = allowSponsorship;
    }

    public Integer getPetSponsorId(){
        if(pSE != null){
            return pSE.getPsid();
        }
        return null;
        
    }

    public void setPetSponsorship(PetSponsorshipEntity pSE){
        this.pSE = pSE;
    }
}
