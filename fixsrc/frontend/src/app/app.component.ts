import { AfterViewInit, Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'Figureverse';
  private interactionScript?: HTMLScriptElement;

  ngAfterViewInit(): void {
    // El JS original depende de que todo el DOM ya exista.
    this.interactionScript = document.createElement('script');
    this.interactionScript.src = 'assets/figureverse.js';
    this.interactionScript.defer = true;
    document.body.appendChild(this.interactionScript);
  }

  ngOnDestroy(): void {
    this.interactionScript?.remove();
  }
}
