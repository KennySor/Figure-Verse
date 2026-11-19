package com.figureverse.api.service;

import com.figureverse.api.dto.CatalogosResponse;
import com.figureverse.api.dto.ProductRequest;
import com.figureverse.api.model.Product;
import com.figureverse.api.repository.AdminProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Set;

@Service
public class AdminProductService {

    private static final List<String> CATEGORIAS_VALIDAS = List.of("anime", "gaming", "superheroes", "sci-fi");
    private static final Set<String> CATEGORIAS_SET = Set.copyOf(CATEGORIAS_VALIDAS);
    private static final List<String> BADGES_ESTANDAR = List.of("sale", "new", "preorder");
    private static final Set<String> BADGES_SET = Set.copyOf(BADGES_ESTANDAR);
    private static final String DEFAULT_IMAGE = "assets/img/hero.jpg";

    private final AdminProductRepository adminProductRepository;

    public AdminProductService(AdminProductRepository adminProductRepository) {
        this.adminProductRepository = adminProductRepository;
    }

    public List<Product> buscar(String q, Long id, String categoria, String estado) {
        String qNorm = (q == null) ? "" : q.trim();
        Long idNorm = (id == null) ? -1L : id;
        String categoriaNorm = (categoria == null) ? "" : categoria.trim().toLowerCase();
        if (categoriaNorm.equals("all") || categoriaNorm.equals("todos") || categoriaNorm.equals("todas")) {
            categoriaNorm = "";
        }

        String estadoNorm = (estado == null || estado.isBlank()) ? "todos" : estado.trim().toLowerCase();
        if (!estadoNorm.equals("todos") && !estadoNorm.equals("activos") && !estadoNorm.equals("inactivos")) {
            estadoNorm = "todos";
        }

        return adminProductRepository.buscarAdmin(qNorm, idNorm, categoriaNorm, estadoNorm);
    }

    public Product obtener(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del producto es obligatorio");
        }
        return adminProductRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new NoSuchElementException("Producto no encontrado con ID: " + id));
    }

    public Product crear(ProductRequest request) {
        Product product = new Product();
        validarYMapear(request, product);
        product.setActivo(true);
        return adminProductRepository.save(Objects.requireNonNull(product));
    }

    public Product actualizar(Long id, ProductRequest request) {
        Product product = obtener(id);
        validarYMapear(request, product);
        return adminProductRepository.save(Objects.requireNonNull(product));
    }

    public Product cambiarEstado(Long id, Boolean activo) {
        if (activo == null) {
            throw new IllegalArgumentException("El campo 'activo' es obligatorio");
        }
        Product product = obtener(id);
        product.setActivo(activo);
        return adminProductRepository.save(Objects.requireNonNull(product));
    }

    public CatalogosResponse catalogos() {
        return new CatalogosResponse(
                CATEGORIAS_VALIDAS,
                adminProductRepository.findDistinctMarcas(),
                adminProductRepository.findDistinctUniversos(),
                adminProductRepository.findDistinctEscalas(),
                BADGES_ESTANDAR
        );
    }

    private void validarYMapear(ProductRequest request, Product product) {
        if (request == null) {
            throw new IllegalArgumentException("Los datos del producto son obligatorios");
        }

        // 1. name: obligatorio, longitud entre 1 y 150 caracteres (hacer trim)
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del producto es obligatorio");
        }
        String nameTrimmed = request.getName().trim();
        if (nameTrimmed.length() > 150) {
            throw new IllegalArgumentException("El nombre del producto debe tener entre 1 y 150 caracteres");
        }

        // 2. category: obligatoria, debe ser una de: anime, gaming, superheroes, sci-fi
        if (request.getCategory() == null || request.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("La categoría es obligatoria");
        }
        String categoryNorm = request.getCategory().trim().toLowerCase();
        if (!CATEGORIAS_SET.contains(categoryNorm)) {
            throw new IllegalArgumentException("La categoría debe ser una de: anime, gaming, superheroes, sci-fi");
        }

        // 3. price: obligatorio y > 0
        Double price = request.getPrice();
        if (price == null || !Double.isFinite(price) || price <= 0) {
            throw new IllegalArgumentException("El precio es obligatorio y debe ser mayor a 0");
        }

        // 4. oldPrice: opcional (puede ser null), pero si se envía debe ser estrictamente > price
        Double oldPrice = request.getOldPrice();
        if (oldPrice != null) {
            if (!Double.isFinite(oldPrice) || oldPrice <= price) {
                throw new IllegalArgumentException("El precio anterior (oldPrice) debe ser estrictamente mayor al precio actual");
            }
        }

        // 5. stock: obligatorio y >= 0
        Integer stock = request.getStock();
        if (stock == null || stock < 0) {
            throw new IllegalArgumentException("El stock es obligatorio y debe ser mayor o igual a 0");
        }

        // 6. rating: entre 0 y 5 (si viene null, asignar 0.0 por defecto; si reviews viene null, asignar 0)
        double ratingVal = (request.getRating() == null) ? 0.0 : request.getRating();
        if (!Double.isFinite(ratingVal) || ratingVal < 0.0 || ratingVal > 5.0) {
            throw new IllegalArgumentException("El rating debe estar entre 0 y 5");
        }

        int reviewsVal = (request.getReviews() == null) ? 0 : request.getReviews();
        if (reviewsVal < 0) {
            throw new IllegalArgumentException("El número de reseñas no puede ser negativo");
        }

        // 7. image: si viene null o vacía (isBlank()), asignar por defecto "assets/img/hero.jpg"
        String imageVal = (request.getImage() == null || request.getImage().isBlank())
                ? DEFAULT_IMAGE
                : request.getImage().trim();
        if (imageVal.length() > 500) {
            throw new IllegalArgumentException("La ruta o URL de la imagen no puede exceder 500 caracteres");
        }

        // 8. badge: opcional, pero si se envía debe coincidir con la restricción de BD (sale, new, preorder)
        String badgeVal = (request.getBadge() == null || request.getBadge().isBlank())
                ? null
                : request.getBadge().trim().toLowerCase();
        if (badgeVal != null && !BADGES_SET.contains(badgeVal)) {
            throw new IllegalArgumentException("El badge debe ser uno de: sale, new, preorder");
        }

        // 9. Otros campos compatibles con la entidad Product
        String universeVal = (request.getUniverse() == null) ? "" : request.getUniverse().trim();
        if (universeVal.length() > 255) {
            throw new IllegalArgumentException("El universo no puede exceder 255 caracteres");
        }

        String scaleVal = (request.getScale() == null || request.getScale().isBlank()) ? null : request.getScale().trim();
        if (scaleVal != null && scaleVal.length() > 255) {
            throw new IllegalArgumentException("La escala no puede exceder 255 caracteres");
        }

        String brandVal = (request.getBrand() == null || request.getBrand().isBlank()) ? null : request.getBrand().trim();
        if (brandVal != null && brandVal.length() > 255) {
            throw new IllegalArgumentException("La marca no puede exceder 255 caracteres");
        }

        String descriptionVal = (request.getDescription() == null) ? null : request.getDescription().trim();
        if (descriptionVal != null && descriptionVal.length() > 1000) {
            throw new IllegalArgumentException("La descripción no puede exceder 1000 caracteres");
        }

        product.setName(nameTrimmed);
        product.setUniverse(universeVal);
        product.setCategory(categoryNorm);
        product.setPrice(price);
        product.setOldPrice(oldPrice);
        product.setScale(scaleVal);
        product.setBrand(brandVal);

        // Guardar el stock recibido desde Angular
        product.setStock(request.getStock());

        product.setRating(ratingVal);
        product.setReviews(reviewsVal);
        product.setBadge(badgeVal);
        product.setImage(imageVal);
        product.setDescription(descriptionVal);

    }
}
