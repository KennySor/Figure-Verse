
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  AdminProduct,
  ProductRequest,
  AdminCatalogs,
  AdminProductFilters
} from '../models/admin-product.model';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/admin/products';

  // Obtener todos los productos y aplicar filtros.
  getAll(filters: AdminProductFilters = {}): Observable<AdminProduct[]> {
    let params = new HttpParams();

    if (filters.q?.trim()) {
      params = params.set('q', filters.q.trim());
    }

    if (filters.id !== undefined && filters.id !== null) {
      params = params.set('id', filters.id.toString());
    }

    if (filters.categoria && filters.categoria !== 'all') {
      params = params.set('categoria', filters.categoria);
    }

    if (filters.estado && filters.estado !== 'all') {
      params = params.set('estado', filters.estado);
    }

    return this.http.get<AdminProduct[]>(this.apiUrl, { params });
  }

  // Obtener un producto por su ID.
  getById(id: number): Observable<AdminProduct> {
    return this.http.get<AdminProduct>(`${this.apiUrl}/${id}`);
  }

  // Obtener categorías, marcas, universos, escalas y badges.
  getCatalogs(): Observable<AdminCatalogs> {
    return this.http.get<AdminCatalogs>(`${this.apiUrl}/catalogs`);
  }

  // Crear un nuevo producto.
  create(product: ProductRequest): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(this.apiUrl, product);
  }

  // Editar un producto existente.
  update(id: number, product: ProductRequest): Observable<AdminProduct> {
    return this.http.put<AdminProduct>(
      `${this.apiUrl}/${id}`,
      product
    );
  }

  // Desactivar un producto sin eliminarlo.
  deactivate(id: number): Observable<AdminProduct> {
    return this.changeStatus(id, false);
  }

  // Reactivar un producto.
  reactivate(id: number): Observable<AdminProduct> {
    return this.changeStatus(id, true);
  }

  private changeStatus(
    id: number,
    activo: boolean
  ): Observable<AdminProduct> {
    return this.http.patch<AdminProduct>(
      `${this.apiUrl}/${id}/estado`,
      { activo }
    );
  }
}
