package com.figureverse.api.dto;

public class EstadoRequest {

    private Boolean activo;

    public EstadoRequest() {
    }

    public EstadoRequest(Boolean activo) {
        this.activo = activo;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}

