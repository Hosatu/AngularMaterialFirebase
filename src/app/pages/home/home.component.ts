import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls:[
    "home.component.css"
  ]
})

export class HomeComponent {
  public fullImagePath: string = '/assets/img/pokus-pozadi.png';
  public onToTop(): void {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

}
