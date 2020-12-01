import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CorporaItem, CorporaService } from '@shared';
import { TaskComponent } from '../task';
import * as _ from 'lodash';

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
  public answer: number[] = [];
  public dataSource = new MatTableDataSource<CorporaItem>(_.map(this.answer, (position) => this.corpus.get(position)));
  public isAnswered = false;
  public word = '.*';
  public lemma = '.*';
  public tag = '.*';

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(public corpus: CorporaService) { 
  }

  loadProgress() {
    if (this.progress && this.progress.answer) {
      this.isAnswered = true;
      this.answer = this.progress.answer;
      this.dataSource = new MatTableDataSource<CorporaItem>(_.map(this.answer, (position) => this.corpus.get(position)));
    }
  }

  submit() {
    this.taskSubmitted.emit({
      answer: this.answer,
      points: Math.round(this.calculateF1Score(this.answer, this.data.correct) * this.data.points)
    });
    this.isAnswered = true;
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
    this.answer = this.corpus.find(new RegExp(this.word), new RegExp(this.tag), new RegExp(this.lemma));
    this.dataSource = new MatTableDataSource<CorporaItem>(_.map(this.answer, (position) => this.corpus.get(position)));
    this.dataSource.paginator = this.paginator;
  }

}
