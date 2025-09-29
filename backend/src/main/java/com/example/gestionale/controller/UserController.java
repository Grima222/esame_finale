package com.example.gestionale.controller;

import com.example.gestionale.dto.UserDTO;
import com.example.gestionale.entity.AppUser;
import com.example.gestionale.entity.Role;   // importa l'enum/entità Role
import com.example.gestionale.repository.UserRepository;
import com.example.gestionale.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Ritorna info dell'utente loggato
    @GetMapping("/me")
    public UserDTO getMe(Authentication authentication) {
        if (authentication == null) return null;
        String username = authentication.getName();
        return userService.getUserDTOByUsername(username);
    }

    // Registrazione nuovo utente (solo USER)
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AppUser newUser) {
        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username già esistente");
        }

        // cripta password e assegna ruolo USER
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.setRole(Role.USER);  // <<-- qui usi l’enum separato
        userRepository.save(newUser);

        return ResponseEntity.ok("Registrazione completata con successo!");
    }
}
