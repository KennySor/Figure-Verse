import { Injectable, signal } from '@angular/core';

export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

const API_URL = 'http://localhost:8080/api/auth';
const STORAGE_KEY = 'figureverse_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Usuario con sesión iniciada (o null). Se mantiene al recargar la página. */
  readonly user = signal<AuthUser | null>(this.load());

  isLoggedIn(): boolean {
    return this.user() !== null;
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const user = await this.post<AuthUser>('/login', { email, password });
    this.save(user);
    return user;
  }

  async register(nombre: string, email: string, password: string): Promise<AuthUser> {
    const user = await this.post<AuthUser>('/register', { nombre, email, password });
    this.save(user); // al registrarse queda con la sesión iniciada
    return user;
  }

  logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // sin acceso a localStorage: solo se limpia la memoria
    }
    this.user.set(null);
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    let res: Response;
    try {
      res = await fetch(API_URL + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch {
      throw new Error('No se pudo conectar con el servidor. ¿Está encendido el backend?');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.mensaje ?? 'Ocurrió un error. Intenta de nuevo.');
    }
    return data as T;
  }

  private load(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  private save(user: AuthUser): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // sin acceso a localStorage: la sesión dura hasta recargar
    }
    this.user.set(user);
  }
}