package com.jansuraksha.model;

public class Citizen extends User {
    private String wardId;
    private String wardName;

    public Citizen() {
        super();
        setRole("Citizen");
    }

    public Citizen(String id, String name, String email, String wardId, String wardName, String avatar) {
        super(id, name, email, "Citizen", avatar);
        this.wardId = wardId;
        this.wardName = wardName;
    }

    @Override
    public String getDashboardAccessLevel() {
        return "CITIZEN_PUBLIC_FEED_AND_SUBMIT";
    }

    public String getWardId() { return wardId; }
    public void setWardId(String wardId) { this.wardId = wardId; }

    public String getWardName() { return wardName; }
    public void setWardName(String wardName) { this.wardName = wardName; }
}
