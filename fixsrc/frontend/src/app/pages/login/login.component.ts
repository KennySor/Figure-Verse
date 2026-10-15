import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AuthService, AuthUser } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  readonly auth = inject(AuthService);

  /** Se emite al iniciar sesión o registrarse con éxito (luego se usará para redirigir). */
  @Output() loggedIn = new EventEmitter<AuthUser>();

  mode: 'login' | 'register' = 'login';
  nombre = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  setMode(mode: 'login' | 'register'): void {
    this.mode = mode;
    this.error = '';
  }

  onInput(field: 'nombre' | 'email' | 'password', event: Event): void {
    this[field] = (event.target as HTMLInputElement).value;
  }

  async submit(event: Event): Promise<void> {
    event.preventDefault();
    this.error = this.validate();
    if (this.error) return;

    this.loading = true;
    try {
      const user =
        this.mode === 'login'
          ? await this.auth.login(this.email, this.password)
          : await this.auth.register(this.nombre, this.email, this.password);
      this.password = '';
      this.loggedIn.emit(user);
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Ocurrió un error. Intenta de nuevo.';
    } finally {
      this.loading = false;
    }
  }

  logout(): void {
    this.auth.logout();
  }

  private validate(): string {
    if (this.mode === 'register' && !this.nombre.trim()) return 'Escribe tu nombre.';
    if (!this.email.includes('@')) return 'Escribe un correo válido.';
    if (this.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    return '';
  }
}