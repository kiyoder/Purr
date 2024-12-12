package com.g1appdev.Hubbits.repository;

import org.springframework.stereotype.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.g1appdev.Hubbits.entity.PetSponsorshipEntity;

@Repository
public interface PetSponsorshipRepository extends JpaRepository<PetSponsorshipEntity, Integer>{

    
}
