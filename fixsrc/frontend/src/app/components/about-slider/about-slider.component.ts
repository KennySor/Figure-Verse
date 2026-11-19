import { Component, OnDestroy, OnInit } from "@angular/core";

interface Slide {
  etiqueta: string;
  titulo: string;
  texto: string;
}

@Component({
  selector: "app-about-slider",
  standalone: true,
  templateUrl: "./about-slider.component.html",
  styleUrl: "./about-slider.component.css",
})
export class AboutSliderComponent implements OnInit, OnDestroy {
  slides: Slide[] = [
    {
      etiqueta: "Quiénes somos",
      titulo: "El universo de las figuras coleccionables",
      texto:
        "FigureVerse nace para quienes convierten el fandom en parte de su espacio: anime, gaming, superhéroes y ciencia ficción en un solo lugar.",
    },
    {
      etiqueta: "Nuestra misión",
      titulo: "Piezas originales, envío seguro",
      texto:
        "Ofrecemos figuras 100% originales, envío blindado y preventas con reserva segura para que cada coleccionista compre con confianza.",
    },
    {
      etiqueta: "Nuestro equipo",
      titulo: "Un proyecto hecho por estudiantes de la UTP",
      texto:
        "Cinco integrantes trabajando con Scrum y GitHub para construir una tienda moderna con Angular y Spring Boot.",
    },
  ];

  actual = 0;
  private intervalo?: ReturnType<typeof setInterval>;
  private readonly tiempoMs = 5000;

  ngOnInit(): void {
    this.iniciarAutoplay();
  }

  ngOnDestroy(): void {
    this.detenerAutoplay();
  }

  siguiente(): void {
    this.actual = (this.actual + 1) % this.slides.length;
  }

  anterior(): void {
    this.actual = (this.actual - 1 + this.slides.length) % this.slides.length;
  }

  irA(indice: number): void {
    this.actual = indice;
  }

  iniciarAutoplay(): void {
    this.detenerAutoplay();
    this.intervalo = setInterval(() => this.siguiente(), this.tiempoMs);
  }

  detenerAutoplay(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = undefined;
    }
  }
}
