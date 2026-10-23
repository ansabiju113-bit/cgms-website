package com.jansuraksha.model;

import jakarta.persistence.*;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "user_id", length = 64)
    private String userId;

    @Column(name = "complaint_id", length = 32)
    private String complaintId;

    @Lob
    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "type", length = 32)
    private String type;

    @Column(name = "time_str", length = 32)
    private String time;

    public Notification() {}

    public Notification(String id, String userId, String complaintId, String message, String type, String time) {
        this.id = id;
        this.userId = userId;
        this.complaintId = complaintId;
        this.message = message;
        this.type = type;
        this.time = time;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getComplaintId() { return complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}
