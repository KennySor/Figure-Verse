
import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { LoginComponent } from './pages/login/login.component';

import { AdminProducts } from './pages/admin-products/admin-products';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'productos', component: ProductsComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'admin/productos',
    component: AdminProducts,
    canActivate: [adminGuard]
  },

  { path: '**', redirectTo: '' }
];
