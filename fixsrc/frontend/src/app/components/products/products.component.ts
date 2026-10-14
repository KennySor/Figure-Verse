
import { Component, inject } from '@angular/core';
import { HeroSliderComponent } from '../../components/hero-slider/hero-slider.component';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [HeroSliderComponent, ProductCard],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  private productService = inject(ProductService);

  productos: Product[] = this.productService.getAll();

  agregarAlCarrito(producto: Product): void {
    console.log('Producto seleccionado:', producto);
  }
}



