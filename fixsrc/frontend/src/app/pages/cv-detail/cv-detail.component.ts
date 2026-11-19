import { Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { getMember } from "../../data/team.data";
import { TeamMember } from "../../models/team-member.model";

@Component({
  selector: "app-cv-detail",
  standalone: true,
  templateUrl: "./cv-detail.component.html",
  styleUrl: "./cv-detail.component.css",
})
export class CvDetailComponent {
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  miembro?: TeamMember;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.miembro = getMember(id);
  }

  get pdfUrl(): string {
    const ruta = this.miembro?.cvPdf ?? "";
    return ruta.startsWith("/") ? ruta : "/" + ruta;
  }

  volver(): void {
    this.location.back();
  }
}
