
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  private auth = inject(AuthService);
  private router = inject(Router);

  todosLosProductos: Product[] = this.productService.getAll();
  productos: Product[] = [...this.todosLosProductos];

  //busqueda
  textoBusqueda = '';

  //filtros
  categoriaSeleccionada = 'all';
  universoSeleccionado = 'all';
  precioMinimo = 0;
  precioMaximo = 400;

  // 'asc' para ascendente, 'desc' para descendente
  ordenSeleccionado = 'asc'; 

  //lista de universos disponibles
  get universos(): string[] {
    const productos = this.todosLosProductos.filter(producto => this.categoriaSeleccionada === 'all' || producto.category === this.categoriaSeleccionada);
    return [...new Set(productos.map(producto => producto.universe))].sort();
  }

  //buqueda, filtro y orden junto
  aplicarFiltros(): void {
    const busqueda = this.textoBusqueda.trim().toLowerCase();
    let resultdo = this.todosLosProductos.filter(producto => {
      const coincideBusqueda = 
      producto.name.toLowerCase().includes(busqueda)||
      producto.universe.toLowerCase().includes(busqueda);
    const coincideCategoria = 
    this.categoriaSeleccionada === 'all' || 
    producto.category === this.categoriaSeleccionada;

    const coincideUniverso =
    this.universoSeleccionado === 'all' ||
    producto.universe === this.universoSeleccionado;

    const coincidePrecio =
    producto.price >= this.precioMinimo &&
    producto.price <= this.precioMaximo;

    return (
      coincideBusqueda && 
      coincideCategoria && 
      coincideUniverso && 
      coincidePrecio
    );
    
  });

  //orden x precio
  if(this.ordenSeleccionado === 'asc') {
    resultdo.sort((a, b) => a.price - b.price);
  }
  if(this.ordenSeleccionado === 'desc') {
    resultdo.sort((a, b) => b.price - a.price);
  }
  this.productos = resultdo;
  }

    buscarProductos(): void {
    this.aplicarFiltros();
  }

  cambiarCategoria(): void {
    this.universoSeleccionado = 'all';
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.categoriaSeleccionada = 'all';
    this.universoSeleccionado = 'all';
    this.precioMinimo = 0;
    this.precioMaximo = 400;
    this.ordenSeleccionado = 'default';

    this.aplicarFiltros();
  }

  agregarAlCarrito(producto: Product): void {
  // Sin sesión no se puede comprar: se manda al login y luego se vuelve al catálogo.
  if (!this.auth.isLoggedIn()) {
    this.router.navigate(['/login'], { queryParams: { volver: '/productos' } });
    return;
  }
  console.log('Producto agregado:', producto);
  }
}




