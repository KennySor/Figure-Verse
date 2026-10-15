
import { Component, OnDestroy, OnInit } from '@angular/core';

interface HeroSlide {
  image: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
}

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  templateUrl: './hero-slider.component.html',
  styleUrl: './hero-slider.component.css'
})
export class HeroSliderComponent implements OnInit, OnDestroy {

  slides: HeroSlide[] = [
    {
      image: 'assets/img/accion..jpg',
      label: 'COLECCIÓN DESTACADA',
      title: 'HÉROES',
      subtitle: 'LEGENDARIOS',
      description: 'Descubre figuras exclusivas para tu colección.'
    },
    {
      image: 'src/assets/img/pain.jpg',
      label: 'UNIVERSO ANIME',
      title: 'PODER',
      subtitle: 'SIN LÍMITES',
      description: 'Tus personajes favoritos en figuras increíbles.'
    },
    {
      image: 'src/assets/img/roman.jpg',
      label: 'EDICIONES ESPECIALES',
      title: 'PIEZAS',
      subtitle: 'EXCLUSIVAS',
      description: 'Encuentra tu próxima figura de colección.'
    }
  ];

  currentIndex = 0;
  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  nextSlide(): void {
    this.currentIndex =
      (this.currentIndex + 1) % this.slides.length;
    this.restartAutoplay();
  }

  previousSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length)
      % this.slides.length;
    this.restartAutoplay();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.restartAutoplay();
  }

  private startAutoplay(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex =
        (this.currentIndex + 1) % this.slides.length;
    }, 6500);
  }

  private stopAutoplay(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
