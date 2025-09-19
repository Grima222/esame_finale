package com.example.gestionale.repository;

import com.example.gestionale.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
    // qui possiamo aggiungere query custom se servono
}
