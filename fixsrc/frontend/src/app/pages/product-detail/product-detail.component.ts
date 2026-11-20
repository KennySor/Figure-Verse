
import { Component, inject, OnDestroy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { Subscription, switchMap, of, catchError, map } from 'rxjs';

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
export class ProductDetailComponent implements OnDestroy {

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  private readonly subscription: Subscription;

  product: Product | undefined;
  related: Product[] = [];

  qty = 1;
  added = false;
  needLogin = false;

  cargando = true;
  errorCarga = '';

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
    this.subscription = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));

        this.product = undefined;
        this.related = [];
        this.cargando = true;
        this.errorCarga = '';
        this.qty = 1;
        this.added = false;
        this.needLogin = false;

        window.scrollTo(0, 0);

        if (!Number.isInteger(id) || id <= 0) {
          return of({
            product: undefined as Product | undefined,
            related: [] as Product[]
          });
        }

        return this.productService.getById(id).pipe(
          switchMap(product =>
            this.productService.getAll().pipe(
              map(products => ({
                product: product.activo === false ? undefined : product,
                related: products
                  .filter(p =>
                    p.activo !== false &&
                    p.category === product.category &&
                    p.id !== product.id
                  )
                  .slice(0, 4)
              }))
            )
          ),
          catchError(error => {
            console.error('Error al cargar detalle:', error);
            this.errorCarga = 'No se pudo cargar el producto.';
            return of({
              product: undefined as Product | undefined,
              related: [] as Product[]
            });
          })
        );
      })
    ).subscribe(({ product, related }) => {
      this.product = product;
      this.related = product ? related : [];
      this.cargando = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get categoryLabel(): string {
    return this.product
      ? this.categories[this.product.category] ?? ''
      : '';
  }

  get badgeLabel(): string {
    return this.product?.badge
      ? this.badges[this.product.badge] ?? ''
      : '';
  }

  get discount(): number {
    const p = this.product;

    return p?.oldPrice
      ? Math.round((1 - p.price / p.oldPrice) * 100)
      : 0;
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

    if (max <= 0) return;

    this.qty = Math.min(
      Math.max(1, this.qty + delta),
      max
    );
  }

  addToCart(): void {
    if (!this.auth.isLoggedIn()) {
      this.needLogin = true;
      return;
    }

    this.needLogin = false;
    this.added = true;

    setTimeout(() => {
      this.added = false;
    }, 2000);
  }

  comprarRelacionado(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { volver: this.router.url }
      });
    }
  }
}
