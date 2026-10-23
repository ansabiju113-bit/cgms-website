package com.jansuraksha.repository;

import com.jansuraksha.model.Complaint;
import com.jansuraksha.model.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository providing SQL CRUD & custom JPQL queries.
 */
@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, String> {

    @Query("SELECT c FROM Complaint c ORDER BY c.createdAt DESC")
    List<Complaint> findAllOrderByCreatedAtDesc();

    @Query("SELECT c FROM Complaint c WHERE c.isMerged = false ORDER BY c.createdAt DESC")
    List<Complaint> findActiveComplaints();

    List<Complaint> findByCategory(String category);

    List<Complaint> findByCitizenId(String citizenId);

    List<Complaint> findByStatus(ComplaintStatus status);

    List<Complaint> findByWardId(String wardId);

    @Query("SELECT c FROM Complaint c WHERE c.isMerged = false AND c.category = :category")
    List<Complaint> findActiveByCategory(@Param("category") String category);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status = :status")
    long countByStatus(@Param("status") ComplaintStatus status);
}
