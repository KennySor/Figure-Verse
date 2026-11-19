import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TEAM } from '../../data/team.data';

@Component({
  selector: 'app-team-cards',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './team-cards.component.html',
  styleUrl: './team-cards.component.css'
})
export class TeamCardsComponent {
  team = TEAM;
}