import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskComponent } from '../task';
import * as _ from 'lodash';

export declare type MajkaData = {
  question: string;
  correct: string;
};

@Component({
  selector: 'app-majka',
  templateUrl: './majka.component.html',
  styleUrls: ['./majka.component.css']
})
export class MajkaComponent implements TaskComponent, OnInit {

  @Input() data: MajkaData;
  @Output() taskSubmitted: EventEmitter<boolean> = new EventEmitter();
  public answer: string;
  public majkaWord: string;
  public isAnswered: boolean = false;
  public majkaOptions: {Tag: string, Lemma: string}[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {
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
    if (this.answer == this.data.correct) {
      this.taskSubmitted.emit(true);
    } else {
      this.taskSubmitted.emit(false);
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
