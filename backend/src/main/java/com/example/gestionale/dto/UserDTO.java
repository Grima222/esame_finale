package com.example.gestionale.dto;

import com.example.gestionale.entity.Role;

public class UserDTO {
    private String username;
    private Role role;

    public UserDTO() {}

    public UserDTO(String username, Role role) {
        this.username = username;
        this.role = role;
    }

    // Getter & Setter
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
