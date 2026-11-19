import { Component } from "@angular/core";

interface Fase {
  titulo: string;
  texto: string;
}

interface Ceremonia {
  nombre: string;
  cuando: string;
  texto: string;
}

interface PasoGit {
  titulo: string;
  texto: string;
  comando: string;
}

@Component({
  selector: "app-methodology",
  standalone: true,
  templateUrl: "./methodology.component.html",
  styleUrl: "./methodology.component.css",
})
export class MethodologyComponent {
  fases: Fase[] = [
    {
      titulo: "Planificación",
      texto:
        "Definimos qué debía tener la tienda y repartimos el trabajo entre los 5 integrantes.",
    },
    {
      titulo: "Desarrollo",
      texto:
        "Cada uno programó en su propia rama, solo con los archivos que le tocaban.",
    },
    {
      titulo: "Revisión",
      texto:
        "Probamos lo que hicimos, compilamos el proyecto y corregimos los errores que salían.",
    },
    {
      titulo: "Entrega",
      texto:
        "Juntamos todo en develop respetando el orden de turnos y dejamos el proyecto funcionando.",
    },
  ];

  ceremonias: Ceremonia[] = [
    {
      nombre: "Planificación",
      cuando: "Al iniciar el ciclo",
      texto:
        "Nos juntamos para ver qué tareas tocaba hacer y quién se encargaba de cada una.",
    },
    {
      nombre: "Reunión diaria",
      cuando: "Todos los días",
      texto:
        "Un rato corto para contar qué avanzamos, qué haríamos ese día y si alguien estaba trabado.",
    },
    {
      nombre: "Revisión del avance",
      cuando: "Al terminar el ciclo",
      texto:
        "Mostramos lo que ya estaba listo y el grupo daba su opinión para corregir detalles.",
    },
    {
      nombre: "Retrospectiva",
      cuando: "Después de la revisión",
      texto:
        "Conversamos qué nos salió bien, qué nos costó más y qué podíamos mejorar la próxima vez.",
    },
  ];

  pasosGit: PasoGit[] = [
    {
      titulo: "Crear nuestra rama",
      texto:
        "Cada integrante parte de develop y crea su propia rama para no pisar el trabajo de los demás.",
      comando: "git checkout -b feature/...",
    },
    {
      titulo: "Elegir solo lo nuestro",
      texto:
        "Agregamos únicamente los archivos que nos asignaron, nunca todo el proyecto junto.",
      comando: "git add <ruta exacta>",
    },
    {
      titulo: "Guardar el cambio",
      texto:
        "Hacemos un solo commit, con un mensaje que explica lo que hicimos.",
      comando: 'git commit -m "feat(...)"',
    },
    {
      titulo: "Subir a GitHub",
      texto:
        "Enviamos nuestra rama al repositorio del grupo para que los demás la puedan ver.",
      comando: "git push -u origin <rama>",
    },
    {
      titulo: "Pedir la integración",
      texto:
        "Abrimos una solicitud para unir la rama con develop. Se revisa y se une según el turno.",
      comando: "Solicitud hacia develop",
    },
  ];
}
