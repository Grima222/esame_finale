package com.example.gestionale.controller;

import com.example.gestionale.entity.AppUser;
import com.example.gestionale.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final UserRepository userRepository;

    public LoginController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/login")
    public Map<String, String> login(Authentication authentication) {
        String username = authentication.getName();
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        Map<String, String> response = new HashMap<>();
        response.put("role", user.getRole().name());
        return response;
    }
}
