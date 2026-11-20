
import { Component, inject, OnInit } from '@angular/core';
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
export class ProductsComponent implements OnInit {

  private productService = inject(ProductService);
  private auth = inject(AuthService);
  private router = inject(Router);

  todosLosProductos: Product[] = [];
  productos: Product[] = [];

  cargando = true;
  errorCarga = '';

  textoBusqueda = '';

  categoriaSeleccionada = 'all';
  universoSeleccionado = 'all';
  precioMinimo = 0;
  precioMaximo = 400;

  ordenSeleccionado = 'asc';

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.errorCarga = '';

    this.productService.getAll().subscribe({
      next: (productos) => {
        this.todosLosProductos = productos.filter(
          producto => producto.activo !== false
        );

        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);

        this.errorCarga =
          'No se pudieron cargar los productos desde el servidor.';

        this.cargando = false;
      }
    });
  }

  get universos(): string[] {
    const productos = this.todosLosProductos.filter(
      producto =>
        this.categoriaSeleccionada === 'all' ||
        producto.category === this.categoriaSeleccionada
    );

    return [
      ...new Set(productos.map(producto => producto.universe))
    ].sort();
  }

  aplicarFiltros(): void {
    const busqueda = this.textoBusqueda.trim().toLowerCase();

    let resultado = this.todosLosProductos.filter(producto => {

      const coincideBusqueda =
        producto.name.toLowerCase().includes(busqueda) ||
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

    if (this.ordenSeleccionado === 'asc') {
      resultado.sort((a, b) => a.price - b.price);
    }

    if (this.ordenSeleccionado === 'desc') {
      resultado.sort((a, b) => b.price - a.price);
    }

    this.productos = resultado;
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
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { volver: '/productos' }
      });
      return;
    }

    console.log('Producto agregado:', producto);
  }
}




