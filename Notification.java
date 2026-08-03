package com.jansuraksha.model;

import java.time.LocalDateTime;

/**
 * Domain entity representing real-time status update notifications.
 */
public class Notification {
    private String id;
    private String recipientUserId;
    private String complaintId;
    private String message;
    private String type; // STATUS_CHANGE, WARD_APPROVAL, DEPT_ASSIGNMENT, AI_MERGE, UPVOTE
    private boolean isRead;
    private LocalDateTime timestamp;

    public Notification(String id, String recipientUserId, String complaintId, String message, String type) {
        this.id = id;
        this.recipientUserId = recipientUserId;
        this.complaintId = complaintId;
        this.message = message;
        this.type = type;
        this.isRead = false;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() { return id; }
    public String getRecipientUserId() { return recipientUserId; }
    public String getComplaintId() { return complaintId; }
    public String getMessage() { return message; }
    public String getType() { return type; }
    public boolean isRead() { return isRead; }
    public LocalDateTime getTimestamp() { return timestamp; }

    public void markAsRead() { this.isRead = true; }
}
