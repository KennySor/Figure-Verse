package com.figureverse.api.config;

import com.figureverse.api.model.Product;
import com.figureverse.api.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductDataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;

    public ProductDataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }
        productRepository.saveAll(List.of(
            crear("Superman Unidad", "DC Comics", "superheroes", 280.0, 350.0, "1/6", "S.H.Figuarts", 7, 4.9, 128, "sale", "assets/img/image.png", "Superman de rodillas con capa flexible y manos intercambiables."),
            crear("Batman Arkham Knight", "DC Comics", "superheroes", 320.0, null, "1/6", "Hot Toys", 5, 4.9, 76, "preorder", "assets/img/batman figura.png", "Batman con capa de tela y detalles de armadura del Arkham Knight."),
            crear("Hulk Coleccionable", "Marvel", "superheroes", 210.0, null, "1/6", "Hot Toys", 4, 4.8, 91, null, "assets/img/image copy 2.png", "Hulk con musculatura detallada y ropa rasgada, escala 1/6."),
            crear("Iron Man Armadura Azul", "Marvel", "superheroes", 255.0, null, "1/6", "Hot Toys", 6, 4.8, 31, "preorder", "assets/img/image copy 7.png", "Armadura azul metálica con luces LED y paneles articulados."),
            crear("Moon Knight", "Marvel", "superheroes", 125.0, null, "1/12", "Hasbro", 12, 4.9, 22, "new", "assets/img/image copy 6.png", "Moon Knight con capa y medialuna, de la línea Marvel Legends."),
            crear("RoboCop", "RoboCop", "sci-fi", 185.0, 225.0, "1/6", "Hot Toys", 6, 4.8, 119, "sale", "assets/img/image copy 11.png", "RoboCop con armadura metálica y pistola Auto-9."),
            crear("Depredador Cazador", "Depredador", "sci-fi", 165.0, null, "1/6", "NECA", 8, 4.8, 31, "preorder", "assets/img/image copy 8.png", "El Depredador con máscara, garras y armadura de cazador."),
            crear("Terminator T-800", "Terminator", "sci-fi", 199.0, null, "1/6", "Hot Toys", 6, 4.9, 143, null, "assets/img/Terminator figura.png", "Endoesqueleto metálico con rostro dañado y arma incluida."),
            crear("Xenomorfo Alien", "Alien", "sci-fi", 175.0, null, "1/8", "NECA", 8, 4.8, 131, "new", "assets/img/Alien figura.png", "El xenomorfo con cola articulada y mandíbula móvil."),
            crear("Neo Matrix", "Matrix", "sci-fi", 155.0, null, "1/6", "Hot Toys", 7, 4.6, 77, "preorder", "assets/img/Neo Matrix figura.png", "Neo con gabardina negra y gafas, en pose de esquivar balas."),
            crear("Goku Black Rosé", "Dragon Ball", "anime", 95.0, 120.0, "1/8", "Bandai", 10, 4.7, 53, "sale", "assets/img/image copy 3.png", "Goku Black con cabello rosado y traje oscuro, acabado premium."),
            crear("Naruto Uzumaki", "Naruto", "anime", 165.0, null, "1/8", "Bandai", 9, 5.0, 39, "preorder", "assets/img/image copy 5.png", "Naruto en pose de combate con traje naranja y rostro intercambiable."),
            crear("Vegeta Super Saiyajin", "Dragon Ball", "anime", 175.0, null, "1/6", "Bandai", 10, 4.7, 96, null, "assets/img/Vegeta figura.png", "Vegeta en pose de combate con detalles pintados a mano."),
            crear("Monkey D. Luffy", "One Piece", "anime", 165.0, null, "1/7", "Banpresto", 12, 4.9, 210, "new", "assets/img/image copy 12.png", "Luffy con base dinámica y accesorios."),
            crear("Levi Ackerman", "Ataque a los Titanes", "anime", 149.0, null, "1/7", "Good Smile", 8, 4.8, 154, null, "assets/img/Levi figura.png", "El capitán Levi con equipo de maniobras y capa de la Legión de Reconocimiento."),
            crear("Rambo Primera Sangre", "Rambo", "gaming", 320.0, 390.0, "1/6", "Hot Toys", 4, 4.9, 76, "sale", "assets/img/image copy 4.png", "Rambo con rifle, cinta de munición y vestuario detallado."),
            crear("Roman Reigns", "WWE", "gaming", 89.0, null, "1/10", "Mattel", 14, 4.5, 57, "preorder", "assets/img/image copy 10.png", "Luchador con chaleco táctico y 20 puntos de articulación."),
            crear("Jackie Chan Kung Fu", "Cine de acción", "gaming", 130.0, null, "1/12", "Hot Toys", 9, 4.7, 48, "new", "assets/img/image copy 9.png", "Jackie Chan en pose de artes marciales con tirantes y ropa clara."),
            crear("Freddy Fazbear", "Cinco Noches con Freddy", "gaming", 99.0, 120.0, "1/10", "Funko", 15, 4.4, 88, "sale", "assets/img/Freddy Fazbear figura.png", "El animatrónico más famoso, con micrófono y sombrero."),
            crear("Jason Voorhees", "Viernes 13", "gaming", 119.0, null, "1/6", "NECA", 6, 4.7, 101, null, "assets/img/Jason Voorhees figura.png", "Jason con máscara de hockey y machete, acabado desgastado.")
        ));
    }

    private static Product crear(String name, String universe, String category, double price, Double oldPrice,
                                 String scale, String brand, int stock, double rating, int reviews,
                                 String badge, String image, String description) {
        Product p = new Product();
        p.setName(name);
        p.setUniverse(universe);
        p.setCategory(category);
        p.setPrice(price);
        p.setOldPrice(oldPrice);
        p.setScale(scale);
        p.setBrand(brand);
        p.setStock(stock);
        p.setRating(rating);
        p.setReviews(reviews);
        p.setBadge(badge);
        p.setImage(image);
        p.setDescription(description);
        return p;
    }
}