package com.jansuraksha.model;

public class WardMember extends User {
    private String assignedWardId;
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
