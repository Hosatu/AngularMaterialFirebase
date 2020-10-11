import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, TemplateRef, ElementRef, QueryList, Inject } from '@angular/core';
import { TaskComponent } from '../task';
import { DOCUMENT } from '@angular/common';
import * as _ from "lodash";

export declare type MultifillData = {
  question: string;
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
  @Output() taskSubmitted: EventEmitter<boolean> = new EventEmitter();
  private document;
  public isAnswered = false;
  public isCorrect: boolean[] = [];

  constructor(@Inject(DOCUMENT) document) { 
    this.document = document;
  }

  ngOnInit() {
    for(let answerIndex in this.data.answers) {
      let inputEl = this.document.getElementById(this.data.answers[answerIndex].id);
      inputEl.className = "";
      let label = inputEl.parentNode.querySelector("label[for='" + inputEl.id + "']");
      console.log(label);
      label.innerText = "";
    }
  }

  submit() {
    this.isCorrect = [];
    for(let answerIndex in this.data.answers) {
      let answer = this.data.answers[answerIndex];
      let userAnswer = this.getAnswer(parseInt(answerIndex));
      this.isCorrect.push(_.some(answer.values, (value) => userAnswer.match(new RegExp(value))));
      let inputEl = this.document.getElementById(this.data.answers[answerIndex].id);
      inputEl.className = this.isCorrect[answerIndex] ? "correct" : "incorrect";
      let label = inputEl.parentNode.querySelector("label[for='" + inputEl.id + "']");
      console.log(label);
      label.innerText = this.isCorrect[answerIndex] ? "" : "(správná odpověď: " +this.data.answers[answerIndex].reference + ")"
    }
    if(_.every(this.isCorrect)) {
      this.taskSubmitted.emit(true);
      
    } else {
      this.taskSubmitted.emit(false);
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
