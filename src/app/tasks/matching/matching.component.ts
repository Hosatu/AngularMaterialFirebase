import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskComponent } from '../task';
import * as _ from "lodash";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

export declare interface MatchingData {
  question: string;
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
  @Output() taskSubmitted: EventEmitter<boolean> = new EventEmitter();
  public answer: (string[])[];
  public optionsPool: string[];
  public isCorrect: boolean[];
  public isAnswered: boolean = false;

  constructor() { }

  ngOnInit() {
    this.optionsPool = _.shuffle(this.data.optionsMatch);
    this.answer = new Array(this.data.optionsFixed.length).fill([]);
  }

  submit() {
    this.isCorrect = [];
    for (let fixedIndex in _.keys(this.data.optionsFixed)) {
      this.isCorrect.push(_.xor(this.answer[fixedIndex], this.data.correct[this.data.optionsFixed[fixedIndex]]).length === 0);
    }
    if (_.every(this.isCorrect)) {
      this.taskSubmitted.emit(true);
    } else {
      this.taskSubmitted.emit(false);
    }
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
