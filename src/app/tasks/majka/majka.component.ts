import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskComponent } from '../task';

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
    this.majkaOptions = data['Annot'];
  }

  submit() {
    if(this.answer == this.data.correct) {
      this.taskSubmitted.emit(true);
    } else {
      this.taskSubmitted.emit(false);
    }
    this.isAnswered = true;
  }

}
