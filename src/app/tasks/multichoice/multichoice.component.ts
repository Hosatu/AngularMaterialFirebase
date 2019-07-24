import { Component, OnInit, Input } from '@angular/core';
import { TaskComponent } from '../task';

@Component({
  selector: 'app-multichoice',
  templateUrl: './multichoice.component.html',
  styleUrls: ['./multichoice.component.css']
})
export class MultichoiceComponent implements TaskComponent, OnInit {

  @Input() data: any;
  
  constructor() { }

  ngOnInit() {
  }

}
