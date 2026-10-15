package com.figureverse.api.service;

import com.figureverse.api.model.Product;
import com.figureverse.api.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> listar(String q, String categoria) {
        String texto = q == null ? "" : q.trim().toLowerCase();
        boolean todas = categoria == null || categoria.isBlank() || categoria.equals("all");

        return productRepository.findAll().stream()
                .filter(p -> texto.isEmpty()
                        || p.getName().toLowerCase().contains(texto)
                        || p.getUniverse().toLowerCase().contains(texto))
                .filter(p -> todas || p.getCategory().equals(categoria))
                .sorted(Comparator.comparing(Product::getId))
                .toList();
    }

    public Optional<Product> buscarPorId(Long id) {
        return productRepository.findById(id);
    }
}