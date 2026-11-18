package com.figureverse.api.dto;

import java.util.List;

public class CatalogosResponse {

    private List<String> categorias;
    private List<String> marcas;
    private List<String> universos;
    private List<String> escalas;
    private List<String> badges;

    public CatalogosResponse() {
    }

    public CatalogosResponse(List<String> categorias, List<String> marcas, List<String> universos,
                             List<String> escalas, List<String> badges) {
        this.categorias = categorias;
        this.marcas = marcas;
        this.universos = universos;
        this.escalas = escalas;
        this.badges = badges;
    }

    public List<String> getCategorias() {
        return categorias;
    }

    public void setCategorias(List<String> categorias) {
        this.categorias = categorias;
    }

    public List<String> getMarcas() {
        return marcas;
    }

    public void setMarcas(List<String> marcas) {
        this.marcas = marcas;
    }

    public List<String> getUniversos() {
        return universos;
    }

    public void setUniversos(List<String> universos) {
        this.universos = universos;
    }

    public List<String> getEscalas() {
        return escalas;
    }

    public void setEscalas(List<String> escalas) {
        this.escalas = escalas;
    }

    public List<String> getBadges() {
        return badges;
    }

    public void setBadges(List<String> badges) {
        this.badges = badges;
    }
}

