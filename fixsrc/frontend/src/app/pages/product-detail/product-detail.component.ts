import { Component, Input, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';

// TEMPORAL: producto de prueba. Lo borrare cuando B suba el servicio con los 20 productos.
const DEMO_PRODUCT: Product = {
  id: 1,
  name: 'Goku Edición Coleccionista',
  universe: 'Dragon Ball',
  category: 'anime',
  price: 189,
  oldPrice: 230,
  scale: '1/6',
  brand: 'Bandai',
  stock: 7,
  rating: 4.8,
  reviews: 128,
  badge: 'sale',
  image: 'assets/img/goku.png',
  description:
    'Figura de colección con acabado premium y pose dinámica. Incluye base de exhibición y caja coleccionable numerada.'
};

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  @Input() product: Product | undefined = DEMO_PRODUCT;
   private readonly auth = inject(AuthService);

  qty = 1;
  added = false;
  needLogin = false;

  private readonly categories: Record<string, string> = {
    anime: 'Anime',
    gaming: 'Gaming',
    superheroes: 'Superhéroes',
    'sci-fi': 'Ciencia ficción'
  };

  private readonly badges: Record<string, string> = {
    sale: 'Oferta',
    new: 'Nuevo',
    preorder: 'Preventa'
  };

  get categoryLabel(): string {
    return this.product ? this.categories[this.product.category] : '';
  }

  get badgeLabel(): string {
    return this.product?.badge ? this.badges[this.product.badge] : '';
  }

  get discount(): number {
    const p = this.product;
    return p?.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  }

  get stars(): string {
    const full = Math.round(this.product?.rating ?? 0);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  get stockText(): string {
    const s = this.product?.stock ?? 0;
    if (s === 0) return 'Agotado';
    if (s <= 10) return `¡Últimas ${s} unidades!`;
    return 'Disponible';
  }

  get stockClass(): string {
    const s = this.product?.stock ?? 0;
    return s === 0 ? 'out' : s <= 10 ? 'low' : 'ok';
  }

  changeQty(delta: number): void {
    const max = this.product?.stock ?? 1;
    this.qty = Math.min(Math.max(1, this.qty + delta), max);
  }

    addToCart(): void {
    // Sin sesión no se puede comprar: se avisa y se invita a iniciar sesión.
    if (!this.auth.isLoggedIn()) {
      this.needLogin = true;
      return;
    }
    this.needLogin = false;
    this.added = true;
    setTimeout(() => (this.added = false), 2000);
  }
}