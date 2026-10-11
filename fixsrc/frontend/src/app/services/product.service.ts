import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { PRODUCTS } from '../data/products.data';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: Product[] = PRODUCTS;

  getAll(): Product[] {
    return this.products;
  }
  // ...aquí siguen getById, search y filter que ya tienes
}