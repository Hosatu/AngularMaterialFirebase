import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CorporaItem, CorporaService } from '@shared';
import { TaskComponent } from '../task';
import * as _ from 'lodash';
import { round } from '@shared/utilities';

export declare interface CorpusData {
  question: string;
  points: number;
  correct: number[];
}
@Component({
  selector: 'app-corpus',
  templateUrl: './corpus.component.html',
  styleUrls: ['./corpus.component.css']
})
export class CorpusComponent implements TaskComponent, AfterViewInit {

  @Input() data: CorpusData;
  private _progress: any;
  get progress(): any {
      return this._progress;
  }
  @Input() set progress(value: any) {
      this._progress = value;
      this.loadProgress();
  }
  @Output() taskSubmitted: EventEmitter<{points: number, answer: number[]}> = new EventEmitter();
  public answer: number[];
  public dataSource = new MatTableDataSource<CorporaItem>(_.map(this.answer, (position) => this.corpus.get(position)));
  public dataSourceResults = new MatTableDataSource<CorporaItem>([]);

  public isAnswered = false;
  public word = '.*';
  public lemma = '.*';
  public tag = '.*';

  @ViewChild('main', {static: true}) paginatorMain: MatPaginator;
  @ViewChild('results', {static: true}) paginatorResults: MatPaginator;


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginatorMain;
    this.dataSource.paginator = this.paginatorResults;
  }

  constructor(public corpus: CorporaService) { 
  }

  loadProgress() {
    if (this.progress && this.progress.answer && !this.isAnswered) {
      this.isAnswered = true;
      this.answer = this.progress.answer;
      this.dataSource = new MatTableDataSource<CorporaItem>(_.map(this.answer, (position) => this.corpus.get(position)));
      this.dataSource.paginator = this.paginatorMain;
      this.dataSourceResults = new MatTableDataSource<CorporaItem>(_.map(this.data.correct, (position) => this.corpus.get(position)));
      this.dataSourceResults.paginator = this.paginatorResults;
    }
  }

  submit() {
    this.taskSubmitted.emit({
      answer: this.answer,
      points: this.getPoints()
    });
    this.isAnswered = true;
    this.dataSourceResults = new MatTableDataSource<CorporaItem>(_.map(this.data.correct, (position) => this.corpus.get(position)));
    this.dataSourceResults.paginator = this.paginatorResults;
  }

  getPoints() {
    return round(this.calculateF1Score(this.answer, this.data.correct) * this.data.points, 1);
  }

  getInflection(points: number) {
    return points === 1 ? '' : (points > 1 && points < 5 ? 'y' : 'ů');
  }

  calculateF1Score(dataSampleTrue: number[], correctDataTrue: number[]): number {
    if (dataSampleTrue.length === 0 && correctDataTrue.length > 0) {
      return 0;
    }
    if (dataSampleTrue.length === 0 && correctDataTrue.length == 0) {
      return 1;
    }
    const fullDataset = _.range(this.corpus.getSize());
    const correctDataFalse = _.difference(fullDataset, correctDataTrue);
    const dataSampleFalse = _.difference(fullDataset, dataSampleTrue);
    let TP, FP, TN, FN;
    TP = _.intersection(dataSampleTrue, correctDataTrue).length;
    TN = _.intersection(dataSampleFalse, correctDataFalse).length;
    FP = _.difference(dataSampleTrue, correctDataTrue).length;
    FN = _.difference(dataSampleFalse, correctDataFalse).length;
    const precision = TP / (TP + FP);
    const recall =  TP / (TP + FN);
    return 2 * (precision * recall) / (precision + recall);
  }

  public show() {
    this.answer = this.corpus.find(new RegExp("^"+this.word+"$"), new RegExp("^"+this.tag+"$"), new RegExp("^"+this.lemma+"$"));
    this.dataSource = new MatTableDataSource<CorporaItem>(_.map(this.answer, (position) => this.corpus.get(position)));
    this.dataSource.paginator = this.paginatorMain;
  }

}
