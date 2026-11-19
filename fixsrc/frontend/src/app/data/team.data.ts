import { TeamMember } from "../models/team-member.model";

export const TEAM: TeamMember[] = [
  {
    id: 1,
    nombre: "Janely Kiara Fernandez Zavaleta",
    rol: "Coordinadora",
    foto: "",
    cvPdf: "assets/cv/integrante-1.pdf",
    iniciales: "JF",
  },
  {
    id: 2,
    nombre: "José Fernando Orellana Astovilca",
    rol: "Desarrollador Web",
    foto: "",
    cvPdf: "assets/cv/integrante-2.pdf",
    iniciales: "JO",
  },
  {
    id: 3,
    nombre: "Cesar Ivan Canicani Santos",
    rol: "Desarrollador Web",
    foto: "assets/img/team/foto_cesar.jpeg",
    cvPdf: "assets/cv/cv_cesar.pdf",
    iniciales: "CC",
  },
  {
    id: 4,
    nombre: "Felix David Llacctahuaman Curo",
    rol: "Desarrollador Web",
    foto: "",
    cvPdf: "assets/cv/integrante-4.pdf",
    iniciales: "FL",
  },
  {
    id: 5,
    nombre: "Alessandro Huaracc Ausejo",
    rol: "Desarrollador Web",
    foto: "assets/img/team/foto_alesandro.jpeg",
    cvPdf: "assets/cv/cv_alessandro.pdf",
    iniciales: "AH",
  },
];

export function getMember(id: number): TeamMember | undefined {
  return TEAM.find((m) => m.id === id);
}
