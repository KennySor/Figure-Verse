package com.figureverse.api.controller;

import com.figureverse.api.dto.CatalogosResponse;
import com.figureverse.api.dto.EstadoRequest;
import com.figureverse.api.dto.ProductRequest;
import com.figureverse.api.model.Product;
import com.figureverse.api.service.AdminProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> listar(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String estado) {
        String categoriaFiltro = (categoria != null && !categoria.isBlank()) ? categoria : category;
        List<Product> productos = adminProductService.buscar(q, id, categoriaFiltro, estado);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/catalogs")
    public ResponseEntity<CatalogosResponse> catalogos() {
        return ResponseEntity.ok(adminProductService.catalogos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        try {
            Product product = adminProductService.obtener(id);
            return ResponseEntity.ok(product);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(errorBody(e.getMessage(), "Producto no encontrado"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(errorBody(e.getMessage(), "Datos de solicitud inválidos"));
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody(required = false) ProductRequest request) {
        try {
            Product creado = adminProductService.crear(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(errorBody(e.getMessage(), "Datos del producto inválidos"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @RequestBody(required = false) ProductRequest request) {
        try {
            Product actualizado = adminProductService.actualizar(id, request);
            return ResponseEntity.ok(actualizado);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(errorBody(e.getMessage(), "Producto no encontrado"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(errorBody(e.getMessage(), "Datos del producto inválidos"));
        }
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Long id,
            @RequestBody(required = false) EstadoRequest request) {
        try {
            Boolean activo = (request != null) ? request.getActivo() : null;
            Product actualizado = adminProductService.cambiarEstado(id, activo);
            return ResponseEntity.ok(actualizado);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(errorBody(e.getMessage(), "Producto no encontrado"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(errorBody(e.getMessage(), "Estado inválido"));
        }
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(errorBody(e.getMessage(), "Producto no encontrado"));
    }

    @ExceptionHandler({ IllegalArgumentException.class, HttpMessageNotReadableException.class,
            MethodArgumentTypeMismatchException.class })
    public ResponseEntity<Map<String, String>> handleBadRequest(Exception e) {
        String mensaje  = (e instanceof IllegalArgumentException) ? e.getMessage() : null;
             
        return ResponseEntity.badRequest()
                .body(errorBody(mensaje, "Solicitud inválida: verifique el formato de los datos enviados"));
    }

    private Map<String, String> errorBody(String mensaje, String fallback) {
        String msg = (mensaje != null && !mensaje.isBlank()) ? mensaje : fallback;
        return Map.of("mensaje", msg);
    }
}
