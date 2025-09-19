package com.example.gestionale.controller;

import com.example.gestionale.dto.ItemDTO;
import com.example.gestionale.service.ItemService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    // Lista tutti gli item - USER e ADMIN
    @GetMapping
    public List<ItemDTO> getAllItems() {
        return itemService.getAllItems();
    }

    // Get item by id - USER e ADMIN
    @GetMapping("/{id}")
    public ItemDTO getItem(@PathVariable Long id) {
        return itemService.getItemById(id);
    }

    // Create item - solo ADMIN
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ItemDTO createItem(@RequestBody ItemDTO dto) {
        return itemService.createItem(dto);
    }

    // Update item - solo ADMIN
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ItemDTO updateItem(@PathVariable Long id, @RequestBody ItemDTO dto) {
        return itemService.updateItem(id, dto);
    }

    // Delete item - solo ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
    }
}
