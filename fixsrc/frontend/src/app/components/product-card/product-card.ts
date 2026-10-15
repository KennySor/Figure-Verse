import { RouterLink } from '@angular/router';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
  @Output() agregarAlCarrito = new EventEmitter<Product>();

  mostrarInfo = false;
  favorito = false;

  toggleInfo(): void {
    this.mostrarInfo = !this.mostrarInfo;
  }

  toggleFavorito(): void {
    this.favorito = !this.favorito;
  }

  agregar(): void {
    this.agregarAlCarrito.emit(this.product);
  }

  get descuento(): number {
    if (!this.product.oldPrice) return 0;
    return Math.round((1 - this.product.price / this.product.oldPrice) * 100);
  }

  get estrellas(): string {
    return '★'.repeat(Math.round(this.product.rating)) + '☆'.repeat(5 - Math.round(this.product.rating));
  }
}