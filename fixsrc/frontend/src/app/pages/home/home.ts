import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

interface PromoItem {
  k: string;
  t: string;
  p: string;
  a: string;
  b: string;
}

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  // --- Hero Slider ---
  slideIndex = 0;
  readonly totalSlides = 4;
  readonly HERO_MS = 6500;
  progressWidth = '0%';
  private heroTimer: any;

  // --- Promo Slider ---
  promoData: PromoItem[] = [
    {
      k: 'DROP DE LA SEMANA',
      t: 'Sci-fi <em>legendario</em>',
      p: 'Descuentos especiales en figuras, estatuas y piezas de exhibición seleccionadas.',
      a: 'assets/img/broly.png',
      b: 'assets/img/goku.png'
    },
    {
      k: 'NUEVO EN STOCK',
      t: 'Anime <em>power-up</em>',
      p: 'Nuevos lanzamientos y preventas para llevar tu colección a otro nivel.',
      a: 'assets/img/luffy.png',
      b: 'assets/img/kizaru.png'
    },
    {
      k: 'RESTOCK LIMITADO',
      t: 'Héroes <em>en grande</em>',
      p: 'Estatuas y figuras premium con escalas que convierten la vitrina en un showcase.',
      a: 'assets/img/dorado.png',
      b: 'assets/img/negro..png'
    }
  ];
  promoIndex = 0;
  private promoTimer: any;

  // --- Universes Carousel ---
  @ViewChild('universeRow') universeRowRef?: ElementRef<HTMLDivElement>;
  @ViewChild('uniThumb') uniThumbRef?: ElementRef<HTMLDivElement>;
  thumbWidth = '20%';
  thumbTransform = 'translateX(0%)';

  // --- Flash Sale Timer ---
  hours = '00';
  minutes = '00';
  seconds = '00';
  private flashTimer: any;

  ngOnInit(): void {
    this.startHero();
    this.startPromo();
    this.updateFlashTimer();
    this.flashTimer = setInterval(() => this.updateFlashTimer(), 1000);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateUniThumb();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.heroTimer);
    clearInterval(this.promoTimer);
    clearInterval(this.flashTimer);
  }

  // --- Hero Slider Methods ---
  get slideCounter(): string {
    return String(this.slideIndex + 1).padStart(2, '0');
  }

  setSlide(index: number): void {
    this.slideIndex = (index + this.totalSlides) % this.totalSlides;
    this.triggerProgressBar();
  }

  prevSlide(): void {
    this.setSlide(this.slideIndex - 1);
    this.restartHeroTimer();
  }

  nextSlide(): void {
    this.setSlide(this.slideIndex + 1);
    this.restartHeroTimer();
  }

  goToSlide(index: number): void {
    this.setSlide(index);
    this.restartHeroTimer();
  }

  private startHero(): void {
    this.triggerProgressBar();
    this.heroTimer = setInterval(() => {
      this.setSlide(this.slideIndex + 1);
    }, this.HERO_MS);
  }

  private restartHeroTimer(): void {
    clearInterval(this.heroTimer);
    this.heroTimer = setInterval(() => {
      this.setSlide(this.slideIndex + 1);
    }, this.HERO_MS);
  }

  private triggerProgressBar(): void {
    this.progressWidth = '0%';
    setTimeout(() => {
      this.progressWidth = '100%';
    }, 20);
  }

  // --- Promo Methods ---
  get currentPromo(): PromoItem {
    return this.promoData[this.promoIndex];
  }

  setPromo(index: number): void {
    this.promoIndex = (index + this.promoData.length) % this.promoData.length;
  }

  prevPromo(): void {
    this.setPromo(this.promoIndex - 1);
    this.restartPromoTimer();
  }

  nextPromo(): void {
    this.setPromo(this.promoIndex + 1);
    this.restartPromoTimer();
  }

  goToPromo(index: number): void {
    this.setPromo(index);
    this.restartPromoTimer();
  }

  private startPromo(): void {
    this.promoTimer = setInterval(() => {
      this.setPromo(this.promoIndex + 1);
    }, 7000);
  }

  private restartPromoTimer(): void {
    clearInterval(this.promoTimer);
    this.promoTimer = setInterval(() => {
      this.setPromo(this.promoIndex + 1);
    }, 7000);
  }

  // --- Universes Carousel Methods ---
  private uniStep(): number {
    const row = this.universeRowRef?.nativeElement;
    if (!row) return 235;
    const firstCard = row.querySelector('.universe-card') as HTMLElement | null;
    return (firstCard?.getBoundingClientRect().width || 220) + 15;
  }

  scrollUniverses(direction: 'prev' | 'next'): void {
    const row = this.universeRowRef?.nativeElement;
    if (!row) return;
    const distance = direction === 'next' ? this.uniStep() * 2 : -this.uniStep() * 2;
    row.scrollBy({ left: distance, behavior: 'smooth' });
  }

  onUniScroll(): void {
    this.updateUniThumb();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateUniThumb();
  }

  private updateUniThumb(): void {
    const row = this.universeRowRef?.nativeElement;
    if (!row) return;
    const max = row.scrollWidth - row.clientWidth;
    const ratio = row.scrollWidth > 0 ? row.clientWidth / row.scrollWidth : 1;
    const pos = max > 0 ? row.scrollLeft / max : 0;
    this.thumbWidth = `${Math.max(ratio * 100, 18)}%`;
    this.thumbTransform = `translateX(${pos * (100 / ratio - 100)}%)`;
  }

  // --- Flash Sale Timer ---
  private updateFlashTimer(): void {
    const now = new Date();
    const end = new Date(now);
    end.setHours(24, 0, 0, 0);
    const diff = Math.max(0, end.getTime() - now.getTime());
    this.hours = String(Math.floor(diff / 36e5)).padStart(2, '0');
    this.minutes = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0');
    this.seconds = String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0');
  }
}

export { HomeComponent as Home };
