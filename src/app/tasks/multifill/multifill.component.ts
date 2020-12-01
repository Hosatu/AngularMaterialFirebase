import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, TemplateRef, ElementRef, QueryList, Inject } from '@angular/core';
import { TaskComponent } from '../task';
import { DOCUMENT } from '@angular/common';
import * as _ from 'lodash';

export declare type MultifillData = {
  question: string;
  points: number;
  template: string;
  answers: {id: string, values: string[], reference?: string}[];
};

@Component({
  selector: 'app-multifill',
  templateUrl: './multifill.component.html',
  styleUrls: ['./multifill.component.css']
})
export class MultifillComponent implements TaskComponent, OnInit {
  @Input() data: MultifillData;
  private _progress: any;
  get progress(): any {
      return this._progress;
  }
  @Input() set progress(value: any) {
      this._progress = value;
      this.loadProgress();
  }
  @Output() taskSubmitted: EventEmitter<{points: number, answer: any}> = new EventEmitter();
  private document;
  public isAnswered = false;
  public isCorrect: boolean[] = [];

  constructor(@Inject(DOCUMENT) document) { 
    this.document = document;
  }


  loadProgress() {
    console.log(this.progress);
    if (this.progress && this.progress.answer) {
      for (const answerId of _.keys(this.progress.answer)) {
        this.document.getElementById(answerId).value = this.progress.answer[answerId];
      }
      this.submit(false);
    }
  }

  ngOnInit() {
    for(let answerIndex in this.data.answers) {
      let inputEl = this.document.getElementById(this.data.answers[answerIndex].id);
      inputEl.className = 'multifill';
      let label = inputEl.parentNode.querySelector('label[for=\'' + inputEl.id + '\']');
      console.log(label);
      label.innerText = '';
    }
  }

  submit(send = true) {
    this.isCorrect = [];
    let answers = {};
    for(let answerIndex in this.data.answers) {
      let answer = this.data.answers[answerIndex];
      let userAnswer = this.getAnswer(parseInt(answerIndex));
      answers[this.data.answers[parseInt(answerIndex)].id]= userAnswer;
      this.isCorrect.push(_.some(answer.values, (value) => userAnswer.match(new RegExp(value))));
      let inputEl = this.document.getElementById(this.data.answers[answerIndex].id);
      inputEl.className = this.isCorrect[answerIndex] ? 'multifill correct' : 'multifill incorrect';
      inputEl.disabled = true;
      let label = inputEl.parentNode.querySelector('label[for=\'' + inputEl.id + '\']');
      console.log(label);
      label.innerText = this.isCorrect[answerIndex] ? '' : '(správná odpověď: ' +this.data.answers[answerIndex].reference + ')'
    }
    if(send) {
      this.taskSubmitted.emit({points: Math.round(_.filter(this.isCorrect).length / this.isCorrect.length * this.data.points), answer: answers});
    }
    this.isAnswered = true;
  }

  getAnswer(id: number) {
    if(!this.document.getElementById(this.data.answers[id].id)) {
      return null;
    }
    return this.document.getElementById(this.data.answers[id].id).value;
  }

  isAllFilled() {
    let allFilled = true;
    for(let answerIndex in this.data.answers) {
      if(!this.getAnswer(parseInt(answerIndex))) {
        allFilled = false;
      }
    }
    return allFilled;
  }
}
