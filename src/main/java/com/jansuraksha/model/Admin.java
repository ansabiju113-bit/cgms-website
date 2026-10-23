package com.jansuraksha.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {

    @Column(name = "system_console", length = 128)
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
