
export interface Product {
  id: number;
  name: string;
  universe: string;
  category: 'anime' | 'gaming' | 'superheroes' | 'sci-fi';
  price: number;
  oldPrice?: number | null;
  scale: string;
  brand: string;
  stock: number;
  rating: number;
  reviews: number;
  badge?: 'sale' | 'new' | 'preorder' | null;
  image: string;
  description: string;
  activo?: boolean;
}
