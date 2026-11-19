export interface TeamMember {
  id: number;
  nombre: string;
  rol: string;
  iniciales: string;
  cvPdf: string;
  foto?: string;              // opcional: se agrega cuando haya fotos
  descripcion?: string;
  carrera?: string;
  resumen?: string;
  habilidades?: string[];
  experiencia?: { titulo: string; detalle: string }[];
  contacto?: { email: string; github?: string; linkedin?: string };
}