package com.jansuraksha.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("WARD_MEMBER")
public class WardMember extends User {

    @Column(name = "assigned_ward_id", length = 32)
    private String assignedWardId;

    @Column(name = "assigned_ward_name", length = 128)
    private String wardName;

    public WardMember() {
        super();
        setRole("Ward Member");
    }

    public WardMember(String id, String name, String email, String wardId, String wardName, String avatar) {
        super(id, name, email, "Ward Member", avatar);
        this.assignedWardId = wardId;
        this.wardName = wardName;
    }

    @Override
    public String getDashboardAccessLevel() {
        return "WARD_FIELD_VERIFICATION_AND_APPROVAL";
    }

    public String getAssignedWardId() { return assignedWardId; }
    public void setAssignedWardId(String assignedWardId) { this.assignedWardId = assignedWardId; }

    public String getWardName() { return wardName; }
    public void setWardName(String wardName) { this.wardName = wardName; }
}
