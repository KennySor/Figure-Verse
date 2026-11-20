
export interface AdminProduct {
  id: number;
  name: string;
  universe: string;
  category: string;
  price: number;
  oldPrice: number | null;
  scale: string;
  brand: string;
  stock: number;
  rating: number;
  reviews: number;
  badge: string | null;
  image: string;
  description: string;
  activo: boolean;
}

export interface ProductRequest {
  name: string;
  universe: string;
  category: string;
  price: number;
  oldPrice: number | null;
  scale: string;
  brand: string;
  stock: number;
  rating: number;
  reviews: number;
  badge: string | null;
  image: string;
  description: string;
}

export interface AdminCatalogs {
  categorias: string[];
  marcas: string[];
  universos: string[];
  escalas: string[];
  badges: string[];
}

export interface AdminProductFilters {
  q?: string;
  id?: number;
  categoria?: string;
  estado?: string;
}
