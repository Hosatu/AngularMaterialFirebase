import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CorporaItem, CorporaService, TreeModel } from '@shared';
import { TaskComponent } from '../task';
import * as _ from 'lodash';
import { D3TreeRendererComponent } from '@shared/tree-renderers/d3-tree-renderer/d3-tree-renderer.component';

export declare interface TreesData {
  question: string;
  points: number;
  constituents: string;
  correct: string;
}

@Component({
  selector: 'app-trees',
  templateUrl: './trees.component.html',
  styleUrls: ['./trees.component.css']
})
export class TreesComponent implements TaskComponent, OnInit {

  @Input() data: TreesData;
  private _progress: any;
  get progress(): any {
      return this._progress;
  }
  @Input() set progress(value: any) {
      this._progress = value;
      setTimeout(()=>this.loadProgress(), 1000);
  }
  @Output() taskSubmitted: EventEmitter<{points:number, answer: string}> = new EventEmitter();
  private selected: { [key: string]: TreeModel } = { 'first': null, 'second': null };
  public alerts: any[] = [];
  public constituents;
  public windowWidth: number;
  public isAnswered: boolean = false;
  public counter = 1;
  public tree: TreeModel;
  @ViewChild("mainRenderer", {static: false}) renderer: D3TreeRendererComponent;
  //@ViewChild("resultRenderer", {static: false}) result: D3TreeRendererComponent;



  loadProgress() {
    console.log(this.progress, this.renderer);
    if (this.progress && this.progress.answer && !this.isAnswered && this.renderer) {
      this.isAnswered = true;
      this.reconstructTree(this.progress.answer, this.renderer);
      /*if(this.progress.answer != this.data.correct) {
        this.reconstructTree(this.data.correct, this.result);
      }*/
    }
  };

  reconstructTree(encoded, renderer) {
      this.clear(renderer);
      let lowestNodes = encoded.match(/\[([^\[\],]*),([^\[\],]*)\]/g);
      while(lowestNodes) {
        for(let node of lowestNodes) {
          let [left, right] = node.split(',');
          left = left.replace('[', '');
          right = right.replace(']', '');
          let leftModel = left == 'MERGED_NODE' ? this.tree : _.find(renderer.getNodes(), (item: TreeModel) => item.value == left);
          let rightModel = right == 'MERGED_NODE' ? this.tree : _.find(renderer.getNodes(), (item: TreeModel) => item.value == right);
          this.onNodeSelected(renderer, leftModel);
          this.onNodeSelected(renderer, rightModel);
          this.mergeNodes(renderer);
          encoded = encoded.replace(lowestNodes, 'MERGED_NODE');
          lowestNodes = encoded.match(/\[([^\[\],]*),([^\[\],]*)\]/g);
        }
      }
  }

  getPoints() {
    if(this.tree) {
      return this.tree.export() === this.data.correct ? this.data.points : 0;
    }
  }

  getInflection(points: number) {
    return points === 1 ? '' : (points > 1 && points < 5 ? 'y' : 'ů');
  }

  constructor(
    ) {
      this.windowWidth = (window.innerWidth - 100);
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

  clearSelected(renderer) {
    if (this.selected['first'] !== null) {
      renderer.onNodeSelected(this.selected['first'], 'unselect');
      this.selected['first'] = null;
    }
    if (this.selected['second'] !== null) {
      renderer.onNodeSelected(this.selected['second'], 'unselect');
      this.selected['second'] = null;
    }
  }

  canUnselect() {
    return this.selected['first'] !== null || this.selected['second'] !== null;
  }

  onNodeSelected(renderer, node: TreeModel) {
    if (this.selected['first'] === node) {
      renderer.onNodeSelected(node, 'unselect');
      this.selected['first'] = null;
    } else if (this.selected['second'] === node) {
      renderer.onNodeSelected(node, 'unselect');
      this.selected['second'] = null;
    } else if (this.selected['first'] === null) {
      renderer.onNodeSelected(node, 'selectFirst');
      this.selected['first'] = node;
    } else if (this.selected['second'] === null) {
      renderer.onNodeSelected(node, 'selectSecond');
      this.selected['second'] = node;
    } else {
      this.alerts.push({
        message: 'YOU CAN\'T SELECT MORE THAN TWO NODES',
        type: 'danger'
      });
    }
  }

  clear(renderer) {
    if(!renderer) {
      return;
    }
    this.cleanSelection(renderer);
    renderer.clear();
    this.counter = 0;
    this.tree = null;
  }

  public closeAlert(alert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  mergeNodes(renderer) {
    const allSelected = _.filter(this.selected, (s) => s != null);
    this.tree = renderer.merge(this.counter.toString(), allSelected[0], _.last(allSelected) );
    this.cleanSelection(renderer);
    this.counter++;
  }

  cleanSelection(renderer) {
    for (const id in this.selected) {
      if (this.selected[id] != null) {
        renderer.onNodeSelected(this.selected[id], 'unselect');
        this.selected[id] = null;
      }
    }
  }

  submit() {
    const result = this.tree.export();
    this.isAnswered = true;
    console.log(result, this.data.correct)
    if(result == this.data.correct) {
      this.taskSubmitted.emit({points: this.data.points, answer: result});
    } else {
      this.taskSubmitted.emit({points: 0, answer: result});
      //this.reconstructTree(this.data.correct, this.result);
    }
  }
}
