import { Injectable } from "@angular/core";
import { Product } from "../models/product.model";
import { PRODUCTS } from "../data/products.data";

@Injectable({ providedIn: "root" })
export class ProductService {
  private products: Product[] = PRODUCTS;

  getAll(): Product[] {
    return this.products;
  }

  getById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  search(texto: string): Product[] {
    if (!texto || texto.trim() === "") {
      return this.products;
    }
    const query = texto.toLowerCase().trim();
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.universe.toLowerCase().includes(query),
    );
  }

  filter(
    categoria?: string,
    precioMin?: number,
    precioMax?: number,
  ): Product[] {
    return this.products.filter((p) => {
      const coincideCategoria =
        !categoria || categoria === "all" || p.category === categoria;
      const coincideMin =
        precioMin === undefined || precioMin === null || p.price >= precioMin;
      const coincideMax =
        precioMax === undefined || precioMax === null || p.price <= precioMax;
      return coincideCategoria && coincideMin && coincideMax;
    });
  }
}
