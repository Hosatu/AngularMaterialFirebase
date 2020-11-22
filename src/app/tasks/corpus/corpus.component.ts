import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CorporaItem, CorporaService } from '@shared';
import { TaskComponent } from '../task';
import * as _ from 'lodash';

export declare interface CorpusData {
  question: string;
  correct: CorporaItem[];
}

const containsAll = (arr1, arr2) => 
                arr2.every(arr2Item => arr1.includes(arr2Item))

const sameMembers = (arr1, arr2) => 
                        arr1.length === arr2.length && containsAll(arr1, arr2) && containsAll(arr2, arr1);

@Component({
  selector: 'app-corpus',
  templateUrl: './corpus.component.html',
  styleUrls: ['./corpus.component.css']
})
export class CorpusComponent implements TaskComponent, OnInit, AfterViewInit {

  @Input() data: CorpusData;
  @Output() taskSubmitted: EventEmitter<boolean> = new EventEmitter();
  public answer: CorporaItem[] = [];
  public dataSource = new MatTableDataSource<CorporaItem>(this.answer);
  public isAnswered = false;
  public word = '.*';
  public lemma = '.*';
  public tag = '.*';

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(public corpus: CorporaService) { }

  ngOnInit() {
  }

  submit() {
    console.log(sameMembers(this.answer, this.data.correct));
    if (sameMembers(this.answer, this.data.correct)) {
      this.taskSubmitted.emit(true);
    } else {
      this.taskSubmitted.emit(false);
    }
    this.isAnswered = true;
  }

  public show() {
    this.answer = this.corpus.get(new RegExp(this.word), new RegExp(this.tag), new RegExp(this.lemma));
    this.dataSource = new MatTableDataSource<CorporaItem>(this.answer);
    this.dataSource.paginator = this.paginator;
  }

}
