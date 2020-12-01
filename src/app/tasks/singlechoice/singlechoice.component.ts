import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskComponent } from '../task';

export declare type SinglechoiceData = {
  question: string;
  options: string[];
  points: number;
  correct: string;
};

@Component({
  selector: 'app-singlechoice',
  templateUrl: './singlechoice.component.html',
  styleUrls: ['./singlechoice.component.css']
})
export class SinglechoiceComponent implements TaskComponent, OnInit {

  @Input() data: SinglechoiceData;
  private _progress: any;
  get progress(): any {
      return this._progress;
  }
  @Input() set progress(value: any) {
      this._progress = value;
      this.loadProgress();
  }
  @Output() taskSubmitted: EventEmitter<{points:number, answer: string}> = new EventEmitter();
  public answer: string;
  public isAnswered: boolean = false;

  constructor() { }

  ngOnInit() {
  }


  loadProgress() {
    console.log(this.progress);
    if (this.progress && this.progress.answer) {
      this.answer = this.progress.answer;
      this.isAnswered = true;
    }
  }

  submit() {
    if(this.answer == this.data.correct) {
      this.taskSubmitted.emit({points: this.data.points, answer: this.answer});
    } else {
      this.taskSubmitted.emit({points: 0, answer: this.answer});
    }
    this.isAnswered = true;
  }

}
