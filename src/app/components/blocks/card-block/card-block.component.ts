import { Component } from '@angular/core';

@Component({
  selector: 'app-card-block',
  templateUrl: './card-block.component.html',
  styleUrls: ['./card-block.component.scss']
})
export class CardBlockComponent {
  titleCard = 'Proč vyzkoušet náš kurz?';
  
  subTitleCard = 'A proč ne?';
  contentCard = '';
  angularImage: string;
  angularImage2: '/assets/img/muni-arts.png';


  constructor() {
    this.angularImage = '/assets/img/logo.png'; 
  }

  

}
