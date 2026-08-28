package com.biorevive.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.biorevive.api.model.DeadZone;

@Repository
public interface DeadZoneRepository extends JpaRepository<DeadZone, Long> {
    Optional<DeadZone> findByHexId(String hexId);
}
