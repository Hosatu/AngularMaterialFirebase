import { Component, OnInit } from '@angular/core';
import { ProgressService } from '@shared/services';
import * as firebase from 'firebase'
@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  public progressData;

  constructor(private progress: ProgressService) {
    this.progressData = this.progress.getProgress();
  }

  ngOnInit() {

  }

}
