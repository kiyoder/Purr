package com.g1appdev.Hubbits.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "donations")
public class DonationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donationID;

    private BigDecimal amount;

    @Temporal(TemporalType.DATE)
    private Date donationDate;

    private String frequency;

    private String firstName;       // New field for the donor's first name
    private String lastName;        // New field for the donor's last name
    private String specialMessage;  // New field for any special message

    // Default constructor
    public DonationEntity() {
    }

    // Getters and Setters for new and existing fields

    public Long getDonationID() {
        return donationID;
    }

    public void setDonationID(Long donationID) {
        this.donationID = donationID;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Date getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(Date donationDate) {
        this.donationDate = donationDate;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getSpecialMessage() {
        return specialMessage;
    }

    public void setSpecialMessage(String specialMessage) {
        this.specialMessage = specialMessage;
    }

    @PrePersist
    public void donationDate() {
        if (this.donationDate == null) {
            this.donationDate = new Date();  // Set the current date and time
        }
    }
}
