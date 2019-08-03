import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskComponent } from '../task';

export declare type SinglechoiceData = {
  question: string;
  options: string[];
  correct: string;
};

@Component({
  selector: 'app-singlechoice',
  templateUrl: './singlechoice.component.html',
  styleUrls: ['./singlechoice.component.css']
})
export class SinglechoiceComponent implements TaskComponent, OnInit {

  @Input() data: SinglechoiceData;
  @Output() taskSubmitted: EventEmitter<boolean> = new EventEmitter();
  public answer: string;
  public isAnswered: boolean = false;
  
  constructor() { }

  ngOnInit() {
  }

  submit() {
    if(this.answer == this.data.correct) {
      this.taskSubmitted.emit(true);
    } else {
      this.taskSubmitted.emit(false);
    }
    this.isAnswered = true;
  }

}
