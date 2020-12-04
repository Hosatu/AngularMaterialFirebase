import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskComponent } from '../task';
import * as _ from 'lodash';

export declare type MajkaData = {
  question: string;
  points: number;
  correct: string;
};

@Component({
  selector: 'app-majka',
  templateUrl: './majka.component.html',
  styleUrls: ['./majka.component.css']
})
export class MajkaComponent implements TaskComponent, OnInit {

  @Input() data: MajkaData;
  private _progress: any;
  get progress(): any {
      return this._progress;
  }
  @Input() set progress(value: any) {
      this._progress = value;
      this.loadProgress();
  }
  @Output() taskSubmitted: EventEmitter<{points:number, answer: any}> = new EventEmitter();
  public answer: string;
  public majkaWord: string;
  public isAnswered: boolean = false;
  public majkaOptions: {Tag: string, Lemma: string}[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  async loadProgress() {
    console.log(this.progress);
    if (this.progress && this.progress.answer && !this.isAnswered) {
      this.majkaWord = this.progress.answer.word;
      await this.loadMajka();
      this.answer = this.progress.answer.selected;
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

  async loadMajka() {
    const data = await this.http.get('/languageservices/service.py',{
      params: {
        'call': 'majka',
        'lang': 'cs',
        'output': 'json',
        'text': this.majkaWord
      }
    }).toPromise();
    console.log(data);
    this.majkaOptions = _.map(data[0]['Annot'], (option) => this.processOption(option));
  }

  submit() {
    if(this.answer == this.data.correct) {
      this.taskSubmitted.emit({points: this.data.points, answer: { word: this.majkaWord, selected: this.answer}});
    } else {
      this.taskSubmitted.emit({points: 0, answer: this.answer});
    }
    this.isAnswered = true;
  }

  processOption(option: {Lemma: string, Tag: string}) {
    const category = option.Tag.match(/k[0-9]+/g),
      gender = option.Tag.match(/g[MNIF]/g),
      number = option.Tag.match(/n[PS]/g),
      casus = option.Tag.match(/c[1-7]/g);
    let newTag = category[0];
    if (gender) {
      newTag += gender[0];
    }
    if (number) {
      newTag += number[0];
    }
    if (casus) {
      newTag += casus[0];
    }
    option.Tag = newTag;
    return option;

  }

}
