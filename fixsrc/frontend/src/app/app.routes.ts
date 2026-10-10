import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProductsComponent } from './pages/products/products';
import { ProductDetailComponent } from './pages/product-detail/product-detail';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'productos', component: ProductsComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: '**', redirectTo: '' }
];
