package com.jansuraksha.model;

public class MergeRecommendation {
    private Complaint master;
    private Complaint duplicate;
    private double textSimilarity;
    private double distanceMeters;

    public MergeRecommendation() {}

    public MergeRecommendation(Complaint master, Complaint duplicate, double textSimilarity, double distanceMeters) {
        this.master = master;
        this.duplicate = duplicate;
        this.textSimilarity = textSimilarity;
        this.distanceMeters = distanceMeters;
    }

    public Complaint getMaster() { return master; }
    public void setMaster(Complaint master) { this.master = master; }

    public Complaint getDuplicate() { return duplicate; }
    public void setDuplicate(Complaint duplicate) { this.duplicate = duplicate; }

    public double getTextSimilarity() { return textSimilarity; }
    public void setTextSimilarity(double textSimilarity) { this.textSimilarity = textSimilarity; }

    public double getDistanceMeters() { return distanceMeters; }
    public void setDistanceMeters(double distanceMeters) { this.distanceMeters = distanceMeters; }
}
