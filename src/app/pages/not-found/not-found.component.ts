import { Component } from '@angular/core';

@Component({
  template: `
    <div id="content">
      <mat-card>
          <h1>Stránka nenalezena 404</h1>
            Stránka, kterou hledáte, neexistuje. <a routerLink="/uvod">Hlavní stránka</a>.
      </mat-card>
   </div>
`,
  styles: ['#content { padding: 20px;}']
})

export class PageNotFoundComponent {}
