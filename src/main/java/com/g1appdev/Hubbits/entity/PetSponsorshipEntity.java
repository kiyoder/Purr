package com.g1appdev.Hubbits.entity;


import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class PetSponsorshipEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int psid;

    private double amount;
    private LocalDate sponsorshipDate;
    private double amountGained;
 /*add checkmark on Rehome form to 
    allow sponsor that will popup the amount and end date, then 
    sponsor button on card to input amount. if date expire, inactive button. if ;   */
    
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "pet_id", referencedColumnName = "pid")
    private PetEntity pet;

    public PetSponsorshipEntity(){
        super();
    }

    public PetSponsorshipEntity(int psid, double amount, LocalDate sponsorshipDate, PetEntity pet){
        super();
        this.psid = psid;
        this.amount = amount;
        this.sponsorshipDate = sponsorshipDate;
        this.amountGained = 0;
        this.pet = pet;
    }

    public int getPsid(){
        return psid;
    }

    public void setPsid(int psid){
        this.psid = psid;
    }

    public double getAmount(){
        return amount;
    }

    public void setAmount(double amount){
        this.amount = amount;
    }

    public LocalDate getSponsorshipDate(){
        return sponsorshipDate;
    }

    public void setSponsorshipDate(LocalDate sponsorshipDate){
        this.sponsorshipDate = sponsorshipDate;
    }

    public double getAmountGained(){
        return amountGained;
    }

    public void setAmountGained(double amountGained){
        this.amountGained += amountGained;
    }

    public PetEntity getPet(){
        return pet;
    }

    public void setPet(PetEntity pet){
        this.pet = pet;
    }

    public void addAmountGained(double increment) {
        if (increment < 0) {
            throw new IllegalArgumentException("Increment must be a positive value.");
        }
        this.amountGained += increment;
    }

    public boolean isSponsorshipComplete() {
        return this.amountGained >= this.amount;
    }

    public boolean addToAmountGainedAndCheckCompletion(double increment) {
        addAmountGained(increment);
        return isSponsorshipComplete();
    }
}
