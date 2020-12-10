import { Component } from '@angular/core';
import { AuthService } from '@shared';

@Component({
  selector: 'app-card-block',
  templateUrl: './card-block.component.html',
  styleUrls: ['./card-block.component.scss']
})
export class CardBlockComponent {
  titleCard = 'Proč vyzkoušet náš kurz?';
  
  subTitleCard = '';
  contentCard = '';
  angularImage: string;
  angularImage2: '/assets/img/muni-arts.png';


  constructor(public authService: AuthService) {
    this.angularImage = '/assets/img/logo.png'; 
  }

  

}
