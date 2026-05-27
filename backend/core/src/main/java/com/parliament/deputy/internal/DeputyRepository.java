package com.parliament.deputy.internal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
interface DeputyRepository extends JpaRepository<Deputy, Integer>, JpaSpecificationExecutor<Deputy> {

    List<Deputy> findAllByOrderByAttendanceRateDesc();

    @Query("SELECT d FROM Deputy d WHERE LOWER(d.lastName) LIKE LOWER(CONCAT(:query, '%'))")
    List<Deputy> searchByLastName(String query);
}
