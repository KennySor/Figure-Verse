import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, ProductCard],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  product: Product | undefined;
  related: Product[] = [];

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

  constructor() {
    // Se suscribe al :id para que funcione también al pasar de un producto a otro (relacionados).
    this.route.paramMap.subscribe((params) => {
      const product = this.productService.getById(Number(params.get('id')));
      this.product = product;
      this.related = product
        ? this.productService
            .getAll()
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
        : [];
      this.qty = 1;
      this.added = false;
      this.needLogin = false;
      window.scrollTo(0, 0);
    });
  }

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

  /** Botón "+" de una tarjeta de productos relacionados. */
  comprarRelacionado(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { volver: this.router.url } });
    }
  }
}