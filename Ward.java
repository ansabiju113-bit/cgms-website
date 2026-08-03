package com.jansuraksha.model;

/**
 * Domain entity representing a Panchayath Ward.
 */
public class Ward {
    private String wardId;
    private String wardName;
    private String wardMemberName;
    private int population;
    private int activeComplaints;
    private int resolvedComplaints;

    public Ward(String wardId, String wardName, String wardMemberName, int population) {
        this.wardId = wardId;
        this.wardName = wardName;
        this.wardMemberName = wardMemberName;
        this.population = population;
        this.activeComplaints = 0;
        this.resolvedComplaints = 0;
    }

    public String getWardId() { return wardId; }
    public String getWardName() { return wardName; }
    public String getWardMemberName() { return wardMemberName; }
    public int getPopulation() { return population; }
    public int getActiveComplaints() { return activeComplaints; }
    public int getResolvedComplaints() { return resolvedComplaints; }

    public void incrementActive() { this.activeComplaints++; }
    public void incrementResolved() { 
        if (this.activeComplaints > 0) this.activeComplaints--; 
        this.resolvedComplaints++; 
    }
}
