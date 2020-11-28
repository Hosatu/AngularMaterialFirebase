import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CorporaItem, CorporaService, TreeModel } from '@shared';
import { TaskComponent } from '../task';
import * as _ from 'lodash';
import { D3TreeRendererComponent } from '@shared/tree-renderers/d3-tree-renderer/d3-tree-renderer.component';

export declare interface TreesData {
  question: string;
  constituents: string;
  correct: string;
}

const containsAll = (arr1, arr2) =>
                arr2.every(arr2Item => arr1.includes(arr2Item));

const sameMembers = (arr1, arr2) =>
                        arr1.length === arr2.length && containsAll(arr1, arr2) && containsAll(arr2, arr1);

@Component({
  selector: 'app-trees',
  templateUrl: './trees.component.html',
  styleUrls: ['./trees.component.css']
})
export class TreesComponent implements TaskComponent, OnInit {

  @Input() data: TreesData;
  @Output() taskSubmitted: EventEmitter<boolean> = new EventEmitter();
  private selected: { [key: string]: TreeModel } = { 'first': null, 'second': null };
  public alerts: any[] = [];
  public constituents;
  public windowWidth: number;
  public isAnswered: boolean = false;
  public counter = 1;
  public tree: TreeModel;
  @ViewChild(D3TreeRendererComponent, {static: false}) renderer: D3TreeRendererComponent;

  constructor(
    ) {
      this.windowWidth = window.innerWidth - 100;
    }

  ngOnInit() {
  }

  canMergeIn() {
    const allSelected = _.filter(this.selected, (s) => s != null);
    if (allSelected.length !== 1) {
      return false;
    }
    return !allSelected[0].parent;
  }

  canMerge() {
    const allSelected = _.filter(this.selected, (s) => s != null);
    if (allSelected.length !== 2) {
      return false;
    }
    return !allSelected[0].parent && !allSelected[1].parent;
  }

  clearSelected() {
    if (this.selected['first'] !== null) {
      this.renderer.onNodeSelected(this.selected['first'], 'unselect');
      this.selected['first'] = null;
    }
    if (this.selected['second'] !== null) {
      this.renderer.onNodeSelected(this.selected['second'], 'unselect');
      this.selected['second'] = null;
    }
  }

  canUnselect() {
    return this.selected['first'] !== null || this.selected['second'] !== null;
  }

  onNodeSelected(node: TreeModel) {
    if (this.selected['first'] === node) {
      this.renderer.onNodeSelected(node, 'unselect');
      this.selected['first'] = null;
    } else if (this.selected['second'] === node) {
      this.renderer.onNodeSelected(node, 'unselect');
      this.selected['second'] = null;
    } else if (this.selected['first'] === null) {
      this.renderer.onNodeSelected(node, 'selectFirst');
      this.selected['first'] = node;
    } else if (this.selected['second'] === null) {
      this.renderer.onNodeSelected(node, 'selectSecond');
      this.selected['second'] = node;
    } else {
      this.alerts.push({
        message: 'YOU CAN\'T SELECT MORE THAN TWO NODES',
        type: 'danger'
      });
    }
  }

  clear() {
    this.cleanSelection();
    this.renderer.clear();
    this.counter = 0;
    this.tree = null;
  }

  public closeAlert(alert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  mergeNodes() {
    const allSelected = _.filter(this.selected, (s) => s != null);
    this.tree = this.renderer.merge(this.counter.toString(), allSelected[0], _.last(allSelected) );
    this.cleanSelection();
    this.counter++;
  }

  cleanSelection() {
    for (const id in this.selected) {
      if (this.selected[id] != null) {
        this.renderer.onNodeSelected(this.selected[id], 'unselect');
        this.selected[id] = null;
      }
    }
  }

  submit() {
    const result = this.tree.export();
    if(result == this.data.correct) {
      this.taskSubmitted.emit(true);
    } else {
      this.taskSubmitted.emit(false);
    }
    this.isAnswered = true;
  }
}
