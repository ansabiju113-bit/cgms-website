package com.jansuraksha.model;

/**
 * Subclass representing a Citizen.
 */
public class Citizen extends User {
    private String wardId;
    private int totalComplaintsFiled;
    private int totalUpvotesGiven;

    public Citizen(String id, String name, String email, String phone, String wardId) {
        super(id, name, email, phone, "CITIZEN");
        this.wardId = wardId;
        this.totalComplaintsFiled = 0;
        this.totalUpvotesGiven = 0;
    }

    @Override
    public String getDashboardAccessLevel() {
        return "CITIZEN_PORTAL: View My Grievances, Submit Complaint, Upvote, Live Tracking";
    }

    public String getWardId() { return wardId; }
    public int getTotalComplaintsFiled() { return totalComplaintsFiled; }
    public int getTotalUpvotesGiven() { return totalUpvotesGiven; }

    public void incrementComplaintsCount() { this.totalComplaintsFiled++; }
    public void incrementUpvotesCount() { this.totalUpvotesGiven++; }
}
