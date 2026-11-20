package com.figureverse.api.dto;

public class ProductRequest {

    private String name;
    private String universe;
    private String category;
    private Double price;
    private Double oldPrice;
    private String scale;
    private String brand;
    private Integer stock;
    private Double rating;
    private Integer reviews;
    private String badge;
    private String image;
    private String description;

    public ProductRequest() {
    }

    public ProductRequest(String name, String universe, String category, Double price, Double oldPrice,
                          String scale, String brand, Integer stock, Double rating, Integer reviews,
                          String badge, String image, String description) {
        this.name = name;
        this.universe = universe;
        this.category = category;
        this.price = price;
        this.oldPrice = oldPrice;
        this.scale = scale;
        this.brand = brand;
        this.stock = stock;
        this.rating = rating;
        this.reviews = reviews;
        this.badge = badge;
        this.image = image;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUniverse() {
        return universe;
    }

    public void setUniverse(String universe) {
        this.universe = universe;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getOldPrice() {
        return oldPrice;
    }

    public void setOldPrice(Double oldPrice) {
        this.oldPrice = oldPrice;
    }

    public String getScale() {
        return scale;
    }

    public void setScale(String scale) {
        this.scale = scale;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviews() {
        return reviews;
    }

    public void setReviews(Integer reviews) {
        this.reviews = reviews;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

