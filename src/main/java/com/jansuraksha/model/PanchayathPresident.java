package com.jansuraksha.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("PRESIDENT")
public class PanchayathPresident extends User {

    @Column(name = "panchayath_name", length = 128)
    private String panchayathName;

    public PanchayathPresident() {
        super();
        setRole("Panchayath President");
    }

    public PanchayathPresident(String id, String name, String email, String panchayathName, String avatar) {
        super(id, name, email, "Panchayath President", avatar);
        this.panchayathName = panchayathName;
    }

    @Override
    public String getDashboardAccessLevel() {
        return "PANCHAYATH_DISPATCH_AND_AI_MERGE";
    }

    public String getPanchayathName() { return panchayathName; }
    public void setPanchayathName(String panchayathName) { this.panchayathName = panchayathName; }
}
