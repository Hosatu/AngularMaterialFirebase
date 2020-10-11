import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskComponent } from '../task';
import * as _ from "lodash";

export declare type MultichoiceData = {
  question: string;
  options: string[];
  correct: boolean[];
};
@Component({
  selector: 'app-multichoice',
  templateUrl: './multichoice.component.html',
  styleUrls: ['./multichoice.component.css']
})
export class MultichoiceComponent implements TaskComponent, OnInit {

  @Input() data: MultichoiceData;
  @Output() taskSubmitted: EventEmitter<boolean> = new EventEmitter();
  public answer: boolean[];
  public isCorrect: boolean[];
  public isAnswered: boolean = false;
  
  constructor() { }

  ngOnInit() {
    this.answer = new Array(this.data.options.length).fill(false);
  }

  submit() {
    this.isCorrect = [];
    for(let answerIndex in this.data.correct) {
      this.isCorrect.push(this.answer[answerIndex] == this.data.correct[answerIndex]);
    }
    if(_.every(this.isCorrect)) {
      this.taskSubmitted.emit(true);
    } else {
      this.taskSubmitted.emit(false);
    }
    this.isAnswered = true;
  }

}
