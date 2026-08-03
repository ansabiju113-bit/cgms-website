package com.jansuraksha.model;

/**
 * Domain entity representing a Panchayath Department.
 */
public class Department {
    private String deptId;
    private String name;
    private String headOfficer;
    private String contactEmail;
    private int assignedTasks;

    public Department(String deptId, String name, String headOfficer, String contactEmail) {
        this.deptId = deptId;
        this.name = name;
        this.headOfficer = headOfficer;
        this.contactEmail = contactEmail;
        this.assignedTasks = 0;
    }

    public String getDeptId() { return deptId; }
    public String getName() { return name; }
    public String getHeadOfficer() { return headOfficer; }
    public String getContactEmail() { return contactEmail; }
    public int getAssignedTasks() { return assignedTasks; }

    public void incrementTasks() { this.assignedTasks++; }
}
