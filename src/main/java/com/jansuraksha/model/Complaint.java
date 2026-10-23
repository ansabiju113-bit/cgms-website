package com.jansuraksha.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * SQL Relational Entity mapped to 'complaints' table.
 */
@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @Column(name = "id", length = 32, nullable = false)
    private String id;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "category", nullable = false, length = 64)
    private String category;

    @Lob
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "location", length = 255)
    private String location;

    @Column(name = "latitude")
    private double lat;

    @Column(name = "longitude")
    private double lng;

    @Column(name = "ward_id", length = 32)
    private String wardId;

    @Column(name = "ward_name", length = 128)
    private String wardName;

    @Column(name = "citizen_id", length = 64)
    private String citizenId;

    @Column(name = "citizen_name", length = 128)
    private String citizenName;

    @Column(name = "citizen_email", length = 128)
    private String citizenEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency", length = 20)
    private Urgency urgency;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 32)
    private ComplaintStatus status;

    @Column(name = "upvotes")
    private int upvotes;

    @Column(name = "assigned_department", length = 128)
    private String assignedDepartment;

    @Lob
    @Column(name = "ward_remarks", columnDefinition = "TEXT")
    private String wardRemarks;

    @Lob
    @Column(name = "photo_url", columnDefinition = "CLOB")
    private String photoUrl;

    @Column(name = "created_at", length = 32)
    private String createdAt;

    @Column(name = "is_merged")
    private boolean isMerged;

    @Column(name = "master_complaint_id", length = 32)
    private String masterComplaintId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "complaint_children", joinColumns = @JoinColumn(name = "complaint_id"))
    @Column(name = "child_id", length = 32)
    private List<String> childIds = new ArrayList<>();

    @Column(name = "priority_score")
    private double priorityScore;

    public Complaint() {}

    public Complaint(String id, String title, String category, String description,
                     String location, double lat, double lng, String wardId, String wardName,
                     String citizenId, String citizenName, String citizenEmail,
                     Urgency urgency, ComplaintStatus status, int upvotes,
                     String assignedDepartment, String wardRemarks, String photoUrl,
                     String createdAt) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.location = location;
        this.lat = lat;
        this.lng = lng;
        this.wardId = wardId;
        this.wardName = wardName;
        this.citizenId = citizenId;
        this.citizenName = citizenName;
        this.citizenEmail = citizenEmail;
        this.urgency = urgency;
        this.status = status;
        this.upvotes = upvotes;
        this.assignedDepartment = assignedDepartment;
        this.wardRemarks = wardRemarks;
        this.photoUrl = photoUrl;
        this.createdAt = createdAt;
        this.isMerged = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }

    public String getWardId() { return wardId; }
    public void setWardId(String wardId) { this.wardId = wardId; }

    public String getWardName() { return wardName; }
    public void setWardName(String wardName) { this.wardName = wardName; }

    public String getCitizenId() { return citizenId; }
    public void setCitizenId(String citizenId) { this.citizenId = citizenId; }

    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }

    public String getCitizenEmail() { return citizenEmail; }
    public void setCitizenEmail(String citizenEmail) { this.citizenEmail = citizenEmail; }

    public Urgency getUrgency() { return urgency; }
    public void setUrgency(Urgency urgency) { this.urgency = urgency; }

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public int getUpvotes() { return upvotes; }
    public void setUpvotes(int upvotes) { this.upvotes = upvotes; }

    public String getAssignedDepartment() { return assignedDepartment; }
    public void setAssignedDepartment(String assignedDepartment) { this.assignedDepartment = assignedDepartment; }

    public String getWardRemarks() { return wardRemarks; }
    public void setWardRemarks(String wardRemarks) { this.wardRemarks = wardRemarks; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public boolean isMerged() { return isMerged; }
    public void setMerged(boolean merged) { isMerged = merged; }

    public String getMasterComplaintId() { return masterComplaintId; }
    public void setMasterComplaintId(String masterComplaintId) { this.masterComplaintId = masterComplaintId; }

    public List<String> getChildIds() { return childIds; }
    public void setChildIds(List<String> childIds) { this.childIds = childIds; }

    public double getPriorityScore() { return priorityScore; }
    public void setPriorityScore(double priorityScore) { this.priorityScore = priorityScore; }
}
