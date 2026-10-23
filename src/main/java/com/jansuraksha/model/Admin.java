package com.jansuraksha.model;

public class Admin extends User {
    private String systemConsole;

    public Admin() {
        super();
        setRole("Administrator");
    }

    public Admin(String id, String name, String email, String systemConsole, String avatar) {
        super(id, name, email, "Administrator", avatar);
        this.systemConsole = systemConsole;
    }

    @Override
    public String getDashboardAccessLevel() {
        return "SUPER_ADMIN_OVERRIDE_AND_CONFIG";
    }

    public String getSystemConsole() { return systemConsole; }
    public void setSystemConsole(String systemConsole) { this.systemConsole = systemConsole; }
}
