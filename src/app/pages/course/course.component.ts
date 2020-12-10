import { Component, OnInit } from '@angular/core';
import { ProgressService } from '@shared/services';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  public lessons = [
    {
      id: 'fonetika',
      label: 'Fonetika',
      colspan: 1,
      rowspan: 2,
    },
    {
      id: 'morfologie',
      label: 'Morfologie',
      colspan: 1,
      rowspan: 2,
    },
    {
      id: 'syntax',
      label: 'Syntax',
      colspan: 1,
      rowspan: 2,
    },
    {
      id: 'sémantika',
      label: 'Sémantika',
      colspan: 1,
      rowspan: 2,
    },
    {
      id: 'nástroje',
      label: 'Nástroje',
      colspan: 1,
      rowspan: 2,
    }
  ]

  constructor(private progress: ProgressService) { }

  ngOnInit() {
  }

  isUnlocked(lesson) {
    const progressData = this.progress.getProgress();
    return progressData && progressData[lesson] && progressData[lesson].unlocked;
  }

  isFinished(lesson) {
    const progressData = this.progress.getProgress();
    return progressData && progressData[lesson] && progressData[lesson].finished;
  }

}
