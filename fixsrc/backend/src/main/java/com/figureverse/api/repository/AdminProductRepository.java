package com.figureverse.api.repository;

import com.figureverse.api.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdminProductRepository extends JpaRepository<Product, Long> {

        @Query("""
                        SELECT p FROM Product p
                        WHERE (:id = -1L OR p.id = :id)
                          AND (:categoria = '' OR LOWER(COALESCE(p.category, '')) = LOWER(:categoria))
                          AND (:estado = 'todos'
                               OR (:estado = 'activos' AND p.activo = true)
                               OR (:estado = 'inactivos' AND p.activo = false))
                          AND (:q = ''
                               OR LOWER(COALESCE(p.name, '')) LIKE LOWER(CONCAT('%', :q, '%'))
                               OR LOWER(COALESCE(p.brand, '')) LIKE LOWER(CONCAT('%', :q, '%'))
                               OR LOWER(COALESCE(p.universe, '')) LIKE LOWER(CONCAT('%', :q, '%'))
                               OR LOWER(COALESCE(p.description, '')) LIKE LOWER(CONCAT('%', :q, '%')))
                        ORDER BY p.id ASC
                        """)
        List<Product> buscarAdmin(
                        @Param("q") String q,
                        @Param("id") Long id,
                        @Param("categoria") String categoria,
                        @Param("estado") String estado);

        @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL AND TRIM(p.brand) <> '' ORDER BY p.brand ASC")
        List<String> findDistinctMarcas();

        @Query("SELECT DISTINCT p.universe FROM Product p WHERE p.universe IS NOT NULL AND TRIM(p.universe) <> '' ORDER BY p.universe ASC")
        List<String> findDistinctUniversos();

        @Query("SELECT DISTINCT p.scale FROM Product p WHERE p.scale IS NOT NULL AND TRIM(p.scale) <> '' ORDER BY p.scale ASC")
        List<String> findDistinctEscalas();
}
