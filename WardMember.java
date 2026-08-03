package com.jansuraksha.model;

/**
 * Subclass representing a Ward Member (Authority for specific ward review).
 */
public class WardMember extends User {
    private String assignedWardId;
    private String wardName;
    private int reviewedCount;

    public WardMember(String id, String name, String email, String phone, String assignedWardId, String wardName) {
        super(id, name, email, phone, "WARD_MEMBER");
        this.assignedWardId = assignedWardId;
        this.wardName = wardName;
        this.reviewedCount = 0;
    }

    @Override
    public String getDashboardAccessLevel() {
        return "WARD_REVIEW_PORTAL: Local Field Review, Approve/Reject, Status Remark Updates";
    }

    public String getAssignedWardId() { return assignedWardId; }
    public String getWardName() { return wardName; }
    public int getReviewedCount() { return reviewedCount; }

    public void incrementReviewedCount() { this.reviewedCount++; }
}
