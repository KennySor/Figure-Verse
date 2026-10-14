
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HeroSliderComponent } from '../../components/hero-slider/hero-slider.component';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, HeroSliderComponent, ProductCard],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  private productService = inject(ProductService);

  productos: Product[] = this.productService.getAll();

  textoBusqueda = '';

  buscarProductos(): void {
    this.productos = this.productService.search(this.textoBusqueda);
  }

  agregarAlCarrito(producto: Product): void {
    console.log('Producto seleccionado:', producto);
  }
}




