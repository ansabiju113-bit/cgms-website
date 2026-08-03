package com.jansuraksha.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Core Domain Entity representing a Citizen Complaint / Grievance.
 */
public class Complaint {
    public enum Status { SUBMITTED, UNDER_WARD_REVIEW, APPROVED, REJECTED, IN_PROGRESS, RESOLVED }
    public enum Urgency { LOW, MEDIUM, HIGH, CRITICAL }

    private String id;
    private String title;
    private String category; // Road Damage, Streetlight, Water Supply, Drainage, Garbage, Electricity, Sewage, Public Toilet, Tree Removal, Others
    private String description;
    private String photoUrl;
    private String location;
    private double latitude;
    private double longitude;
    private String wardId;
    private String wardName;
    private String citizenId;
    private String citizenName;
    
    private Status status;
    private Urgency urgency;
    private int upvotesCount;
    private String assignedDepartment;
    private String wardRemarks;
    
    private boolean isMerged;
    private String masterComplaintId;
    private List<String> childComplaintIds;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Complaint(String id, String title, String category, String description, 
                     String photoUrl, String location, double lat, double lng,
                     String wardId, String wardName, String citizenId, String citizenName, Urgency urgency) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.photoUrl = photoUrl;
        this.location = location;
        this.latitude = lat;
        this.longitude = lng;
        this.wardId = wardId;
        this.wardName = wardName;
        this.citizenId = citizenId;
        this.citizenName = citizenName;
        this.urgency = urgency;
        
        this.status = Status.SUBMITTED;
        this.upvotesCount = 1;
        this.assignedDepartment = "Unassigned";
        this.wardRemarks = "";
        this.isMerged = false;
        this.masterComplaintId = null;
        this.childComplaintIds = new ArrayList<>();
        
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Methods
    public void addUpvote() {
        this.upvotesCount++;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateStatus(Status newStatus, String remarks) {
        this.status = newStatus;
        if (remarks != null && !remarks.isEmpty()) {
            this.wardRemarks = remarks;
        }
        this.updatedAt = LocalDateTime.now();
    }

    public void assignDepartment(String department) {
        this.assignedDepartment = department;
        this.status = Status.IN_PROGRESS;
        this.updatedAt = LocalDateTime.now();
    }

    public void mergeInto(Complaint masterComplaint) {
        this.isMerged = true;
        this.masterComplaintId = masterComplaint.getId();
        masterComplaint.upvotesCount += this.upvotesCount;
        masterComplaint.getChildComplaintIds().add(this.id);
        this.status = Status.RESOLVED;
        this.wardRemarks = "Merged into Master Complaint #" + masterComplaint.getId();
        this.updatedAt = LocalDateTime.now();
    }

    // Calculate Public Impact Priority Score (OOP Logic)
    public double calculatePriorityScore() {
        double categoryWeight = switch (category) {
            case "Electricity", "Sewage", "Water Supply" -> 1.5;
            case "Road Damage", "Drainage" -> 1.3;
            case "Tree Removal", "Garbage" -> 1.2;
            default -> 1.0;
        };

        double urgencyMultiplier = switch (urgency) {
            case CRITICAL -> 2.0;
            case HIGH -> 1.5;
            case MEDIUM -> 1.2;
            case LOW -> 1.0;
        };

        // Score formula: (Base Weight * Urgency) + (Upvotes * 0.5)
        return (categoryWeight * urgencyMultiplier * 10) + (upvotesCount * 2.5);
    }

    // Getters and Setters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public String getPhotoUrl() { return photoUrl; }
    public String getLocation() { return location; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public String getWardId() { return wardId; }
    public String getWardName() { return wardName; }
    public String getCitizenId() { return citizenId; }
    public String getCitizenName() { return citizenName; }
    public Status getStatus() { return status; }
    public Urgency getUrgency() { return urgency; }
    public int getUpvotesCount() { return upvotesCount; }
    public String getAssignedDepartment() { return assignedDepartment; }
    public String getWardRemarks() { return wardRemarks; }
    public boolean isMerged() { return isMerged; }
    public String getMasterComplaintId() { return masterComplaintId; }
    public List<String> getChildComplaintIds() { return childComplaintIds; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setUrgency(Urgency urgency) { this.urgency = urgency; }
}
