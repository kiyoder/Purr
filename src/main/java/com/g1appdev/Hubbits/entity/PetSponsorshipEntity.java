package com.g1appdev.Hubbits.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
    private LocalDate expiryDate;
    private double amountGained;
 /*add checkmark on Rehome form to 
    allow sponsor that will popup the amount and end date, then 
    sponsor button on card to input amount. if date expire, inactive button. if ;   */
    

    @OneToOne
    @JoinColumn(name = "pet_id", referencedColumnName = "pid")
    @JsonBackReference
    private PetEntity pet;

    public PetSponsorshipEntity(){
        super();
    }

    public PetSponsorshipEntity(int psid, double amount, LocalDate expiryDate){
        super();
        this.psid = psid;
        this.amount = amount;
        this.expiryDate = expiryDate;
        this.amountGained = 0;
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

    public LocalDate getExpiryDate(){
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate){
        this.expiryDate = expiryDate;
    }

    public double getAmountGained(){
        return amountGained;
    }

    public void setAmountGained(double amountGained){
        this.amountGained += amountGained;
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

    public boolean isSponsorshipInactive() {
        LocalDate today = LocalDate.now();
        return isSponsorshipComplete() || (this.expiryDate != null && this.expiryDate.isBefore(today));
    }

}
