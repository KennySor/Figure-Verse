
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AdminProductService } from '../../services/admin-product.service';
import {
  AdminProduct,
  AdminCatalogs,
  ProductRequest,
  AdminProductFilters
} from '../../models/admin-product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProducts implements OnInit, OnDestroy {
  private readonly service = inject(AdminProductService);
  private searchTimer?: ReturnType<typeof setTimeout>;
  private requestVersion = 0;

  productos: AdminProduct[] = [];
  catalogos: AdminCatalogs = {
    categorias: [],
    marcas: [],
    universos: [],
    escalas: [],
    badges: []
  };

  busqueda = '';
  categoria = 'all';
  estado = 'all';

  cargando = false;
  guardando = false;
  error = '';
  mensaje = '';

  mostrarFormulario = false;
  editandoId: number | null = null;

  formulario: ProductRequest = this.formularioVacio();

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.cargarProductos(),
      this.cargarCatalogos()
    ]);
  }

  ngOnDestroy(): void {
    clearTimeout(this.searchTimer);
    this.requestVersion++;
  }

  buscar(): void {
    clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(() => {
      void this.cargarProductos();
    }, 300);
  }

  cambiarFiltros(): void {
    clearTimeout(this.searchTimer);
    void this.cargarProductos();
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.categoria = 'all';
    this.estado = 'all';
    this.cambiarFiltros();
  }

  async cargarProductos(): Promise<void> {
    const version = ++this.requestVersion;
    this.cargando = true;
    this.error = '';

    const filtros: AdminProductFilters = {
      categoria: this.categoria,
      estado: this.estado
    };

    const texto = this.busqueda.trim();

    if (/^\d+$/.test(texto)) {
      filtros.id = Number(texto);
    } else if (texto) {
      filtros.q = texto;
    }

    try {
      const productos = await firstValueFrom(
        this.service.getAll(filtros)
      );

      if (version === this.requestVersion) {
        this.productos = productos;
      }
    } catch (e) {
      if (version === this.requestVersion) {
        this.error = this.obtenerError(e);
      }
    } finally {
      if (version === this.requestVersion) {
        this.cargando = false;
      }
    }
  }

  async cargarCatalogos(): Promise<void> {
    try {
      this.catalogos = await firstValueFrom(
        this.service.getCatalogs()
      );
    } catch (e) {
      this.error = this.obtenerError(e);
    }
  }

  nuevoProducto(): void {
    this.editandoId = null;
    this.formulario = this.formularioVacio();
    this.mostrarFormulario = true;
    this.error = '';
    this.mensaje = '';
  }

  editarProducto(producto: AdminProduct): void {
    this.editandoId = producto.id;

    this.formulario = {
      name: producto.name,
      universe: producto.universe,
      category: producto.category,
      price: producto.price,
      oldPrice: producto.oldPrice,
      scale: producto.scale,
      brand: producto.brand,
      stock: producto.stock,
      rating: producto.rating,
      reviews: producto.reviews,
      badge: producto.badge,
      image: producto.image,
      description: producto.description
    };

    this.mostrarFormulario = true;
    this.error = '';
    this.mensaje = '';
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.editandoId = null;
  }

  async guardarProducto(): Promise<void> {
    if (this.guardando) return;

    const precio = Number(this.formulario.price);

    const precioAnterior =
      this.formulario.oldPrice === null ||
      this.formulario.oldPrice === undefined ||
      this.formulario.oldPrice === 0
        ? null
        : Number(this.formulario.oldPrice);

    if (!Number.isFinite(precio) || precio <= 0) {
      this.error = 'El precio debe ser mayor a 0.';
      return;
    }

    if (precioAnterior !== null && precioAnterior <= precio) {
      this.error =
        'El precio anterior debe ser mayor que el precio actual. Puedes dejarlo vacío si no hay descuento.';
      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    try {
      const datos: ProductRequest = {
        ...this.formulario,
        oldPrice: this.formulario.oldPrice || null,
        badge: this.formulario.badge || null
      };

      if (this.editandoId === null) {
        await firstValueFrom(this.service.create(datos));
        this.mensaje = 'Producto creado correctamente.';
      } else {
        await firstValueFrom(
          this.service.update(this.editandoId, datos)
        );
        this.mensaje = 'Producto actualizado correctamente.';
      }

      this.cancelar();
      await this.cargarProductos();
      await this.cargarCatalogos();
    } catch (e) {
      this.error = this.obtenerError(e);
    } finally {
      this.guardando = false;
    }
  }

  async cambiarEstado(producto: AdminProduct): Promise<void> {
    const accion = producto.activo ? 'desactivar' : 'reactivar';

    if (!confirm(`¿Deseas ${accion} "${producto.name}"?`)) {
      return;
    }

    this.error = '';
    this.mensaje = '';

    try {
      if (producto.activo) {
        await firstValueFrom(
          this.service.deactivate(producto.id)
        );
      } else {
        await firstValueFrom(
          this.service.reactivate(producto.id)
        );
      }

      this.mensaje = `Producto ${producto.activo ? 'desactivado' : 'reactivado'} correctamente.`;
      await this.cargarProductos();
    } catch (e) {
      this.error = this.obtenerError(e);
    }
  }

  private formularioVacio(): ProductRequest {
    return {
      name: '',
      universe: '',
      category: 'anime',
      price: 0,
      oldPrice: null,
      scale: '',
      brand: '',
      stock: 0,
      rating: 0,
      reviews: 0,
      badge: null,
      image: '',
      description: ''
    };
  }

  private obtenerError(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'error' in error
    ) {
      const response = error as {
        error?: { mensaje?: string };
      };

      if (response.error?.mensaje) {
        return response.error.mensaje;
      }
    }

    return 'No se pudo completar la operación. Revisa la conexión con el servidor.';
  }
}
