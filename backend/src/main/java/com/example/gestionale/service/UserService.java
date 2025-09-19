package com.example.gestionale.service;

import com.example.gestionale.dto.UserDTO;
import com.example.gestionale.entity.AppUser;
import com.example.gestionale.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Trova user per username e ritorna UserDTO
    public UserDTO getUserDTOByUsername(String username) {
        Optional<AppUser> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return null;
        AppUser user = userOpt.get();
        return new UserDTO(user.getUsername(), user.getRole());
    }
}
