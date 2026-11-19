import { Component } from "@angular/core";
import { getMember } from "../../data/team.data";
import { TeamMember } from "../../models/team-member.model";

@Component({
  selector: "app-org-chart",
  standalone: true,
  templateUrl: "./org-chart.component.html",
  styleUrl: "./org-chart.component.css",
})
export class OrgChartComponent {
  lider: TeamMember | undefined = getMember(1);

  equipo: TeamMember[] = [2, 3, 4, 5]
    .map((id) => getMember(id))
    .filter((m): m is TeamMember => !!m);
}
