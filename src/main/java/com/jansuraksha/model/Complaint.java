package com.jansuraksha.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Core Domain Entity representing a Grievance Ticket.
 */
public class Complaint {
    private String id;
    private String title;
    private String category;
    private String description;
    private String location;
    private double lat;
    private double lng;
    private String wardId;
    private String wardName;
    private String citizenId;
    private String citizenName;
    private String citizenEmail;
    private Urgency urgency;
    private ComplaintStatus status;
    private int upvotes;
    private String assignedDepartment;
    private String wardRemarks;
    private String photoUrl;
    private String createdAt;
    private boolean isMerged;
    private String masterComplaintId;
    private List<String> childIds = new ArrayList<>();
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

    // Getters and Setters
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
