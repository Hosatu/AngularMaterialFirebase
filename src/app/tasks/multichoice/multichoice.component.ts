import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskComponent } from '../task';
import * as _ from "lodash";

export declare type MultichoiceData = {
  question: string;
  options: string[];
  points: number;
  correct: boolean[];
};
@Component({
  selector: 'app-multichoice',
  templateUrl: './multichoice.component.html',
  styleUrls: ['./multichoice.component.css']
})
export class MultichoiceComponent implements TaskComponent, OnInit {

  @Input() data: MultichoiceData;
  private _progress: any;
  get progress(): any {
      return this._progress;
  }
  @Input() set progress(value: any) {
      this._progress = value;
      this.loadProgress();
  }
  @Output() taskSubmitted: EventEmitter<{points: number, answer: boolean[]}> = new EventEmitter();
  public answer: boolean[];
  public isCorrect: boolean[];
  public isAnswered: boolean = false;
  
  constructor() { }

  ngOnInit() {
    if(!this.answer) {
      this.answer = new Array(this.data.options.length).fill(false);
    }
  }


  loadProgress() {
    console.log(this.progress);
    if (this.progress && this.progress.answer) {
      this.answer = this.progress.answer;
      this.isCorrect = [];
      for(let answerIndex in this.data.correct) {
        this.isCorrect.push(this.answer[answerIndex] == this.data.correct[answerIndex]);
      }
      this.isAnswered = true;
    }
  }

  submit() {
    this.isCorrect = [];
    for(let answerIndex in this.data.correct) {
      this.isCorrect.push(this.answer[answerIndex] == this.data.correct[answerIndex]);
    }
    this.taskSubmitted.emit({points: Math.round(_.filter(this.isCorrect).length / this.isCorrect.length * this.data.points), answer: this.answer});
    this.isAnswered = true;
  }

}
