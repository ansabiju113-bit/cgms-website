package com.jansuraksha.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("CITIZEN")
public class Citizen extends User {

    @Column(name = "ward_id", length = 32)
    private String wardId;

    @Column(name = "ward_name", length = 128)
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
