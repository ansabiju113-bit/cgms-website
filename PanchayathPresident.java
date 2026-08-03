package com.jansuraksha.model;

/**
 * Subclass representing Panchayath President.
 */
public class PanchayathPresident extends User {
    private String panchayathRegion;

    public PanchayathPresident(String id, String name, String email, String phone, String panchayathRegion) {
        super(id, name, email, phone, "PRESIDENT");
        this.panchayathRegion = panchayathRegion;
    }

    @Override
    public String getDashboardAccessLevel() {
        return "EXECUTIVE_PORTAL: All-Ward Monitoring, Prioritization, Dept Allocation, Analytics & Reports";
    }

    public String getPanchayathRegion() { return panchayathRegion; }
}
