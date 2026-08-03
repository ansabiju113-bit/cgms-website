package com.jansuraksha.model;

/**
 * Subclass representing Administrator.
 */
public class Administrator extends User {
    private String adminLevel;

    public Administrator(String id, String name, String email, String phone, String adminLevel) {
        super(id, name, email, phone, "ADMIN");
        this.adminLevel = adminLevel;
    }

    @Override
    public String getDashboardAccessLevel() {
        return "ADMIN_PORTAL: User Management, Ward & Category Configuration, System Stats & AI Tuning";
    }

    public String getAdminLevel() { return adminLevel; }
}
