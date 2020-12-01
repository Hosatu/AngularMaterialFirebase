import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskComponent } from '../task';
import * as _ from "lodash";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

export declare interface MatchingData {
  question: string;
  points: number;
  optionsFixed: string[];
  optionsMatch: string[];
  correct: {[fixed: string]: string[]};
}

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss']
})
export class MatchingComponent implements TaskComponent, OnInit {

  @Input() data: MatchingData;
  private _progress: any;
  get progress(): any {
      return this._progress;
  }
  @Input() set progress(value: any) {
      this._progress = value;
      this.loadProgress();
  }
  @Output() taskSubmitted: EventEmitter<{points: number, answer: any}> = new EventEmitter();
  public answer: {[key: number]: string[]};
  public optionsPool: string[];
  public isCorrect: boolean[];
  public isAnswered: boolean = false;

  constructor() { }

  ngOnInit() {
    this.optionsPool = _.shuffle(this.data.optionsMatch);
    this.answer = {};
    for (const i of _.range(this.data.optionsFixed.length)) {
      this.answer[parseInt(i)] = [];
    }
  }


  loadProgress() {
    console.log(this.progress);
    if (this.progress && this.progress.answer) {
      this.isCorrect = [];
      this.optionsPool = [];
      this.answer = this.progress.answer;
      for (let fixedIndex in _.keys(this.data.optionsFixed)) {
        this.isCorrect.push(_.xor(this.answer[fixedIndex], this.data.correct[this.data.optionsFixed[fixedIndex]]).length === 0);
      }
      this.isAnswered = true;
    }
  }

  submit() {
    this.isCorrect = [];
    for (let fixedIndex in _.keys(this.data.optionsFixed)) {
      this.isCorrect.push(_.xor(this.answer[fixedIndex], this.data.correct[this.data.optionsFixed[fixedIndex]]).length === 0);
    }
    this.taskSubmitted.emit({points: Math.round(_.filter(this.isCorrect).length / this.isCorrect.length * this.data.points), answer: this.answer});
    this.isAnswered = true;
  }

  public drop(event: CdkDragDrop<string[]>, index: number = -1): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item: string[] = event.previousContainer.data.splice(event.previousIndex, 1);
      if (index !== -1) {
        this.answer[index] = event.container.data.concat(item);
      }   else {
        this.optionsPool = event.container.data.concat(item);
      }
    }
  }

}
