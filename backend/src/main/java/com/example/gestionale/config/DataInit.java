package com.example.gestionale.config;

import com.example.gestionale.entity.AppUser;
import com.example.gestionale.entity.Role;
import com.example.gestionale.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInit {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.findAll().isEmpty()) {
                userRepository.save(new AppUser("admin", encoder.encode("ciao123"), Role.ADMIN));
                userRepository.save(new AppUser("user", encoder.encode("user123"), Role.USER));
            }
        };
    }
}
