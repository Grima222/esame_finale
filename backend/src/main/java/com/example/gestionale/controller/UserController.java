package com.example.gestionale.controller;

import com.example.gestionale.dto.UserDTO;
import com.example.gestionale.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Ritorna info dell'utente loggato
    @GetMapping("/me")
    public UserDTO getMe(Authentication authentication) {
        if (authentication == null) return null;
        String username = authentication.getName();
        return userService.getUserDTOByUsername(username);
    }
}
