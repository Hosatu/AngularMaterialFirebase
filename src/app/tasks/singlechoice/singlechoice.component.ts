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
    if (this.progress && this.progress.answer  && !this.isAnswered) {
      this.answer = this.progress.answer;
      this.isAnswered = true;
    }
  }

  getOptionColor(option) {
    if(this.isAnswered == false) {
      return [];
    }
    if (option == this.data.correct) {
      return ['correct'];
    }
      return ['incorrect'];
  }

  getCorrectAnswer() {
    if(this.isAnswered == false) {
      return '';
    }
    if (this.data.correct == this.answer) {
      return 'Správně! (' + this.data.points + ' bod' + this.getInflection(this.data.points) + ')';
    }
    return 'Špatně! Správná odpověď je ' + this.data.correct + '. (0 bodů)';
  }

  getInflection(points: number) {
    return points === 1 ? '' : (points > 1 && points < 5 ? 'y' : 'ů');
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
