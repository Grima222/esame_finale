package com.example.gestionale.service;

import com.example.gestionale.dto.ItemDTO;
import com.example.gestionale.entity.Item;
import com.example.gestionale.exception.ResourceNotFoundException;
import com.example.gestionale.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    // Lista di tutti gli item
    public List<ItemDTO> getAllItems() {
        return itemRepository.findAll()
                .stream()
                .map(i -> new ItemDTO(i.getId(), i.getName(), i.getQuantity()))
                .collect(Collectors.toList());
    }

    // Get by ID
    public ItemDTO getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item non trovato con id " + id));
        return new ItemDTO(item.getId(), item.getName(), item.getQuantity());
    }

    // Create
    public ItemDTO createItem(ItemDTO dto) {
        Item item = new Item();
        item.setName(dto.getName());
        item.setQuantity(dto.getQuantity());
        Item saved = itemRepository.save(item);
        return new ItemDTO(saved.getId(), saved.getName(), saved.getQuantity());
    }

    // Update
    public ItemDTO updateItem(Long id, ItemDTO dto) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item non trovato con id " + id));
        item.setName(dto.getName());
        item.setQuantity(dto.getQuantity());
        Item saved = itemRepository.save(item);
        return new ItemDTO(saved.getId(), saved.getName(), saved.getQuantity());
    }

    // Delete
    public void deleteItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item non trovato con id " + id));
        itemRepository.delete(item);
    }
}
