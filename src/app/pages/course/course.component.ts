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
      rowspan: 1,
    },
    {
      id: 'aplikace',
      label: 'Aplikace',
      colspan: 1,
      rowspan: 2,
    },
    {
      id: 'test',
      label: 'Test',
      colspan: 1,
      rowspan: 2,
    },
    {
      id: 'semantika',
      label: 'Sémantika',
      colspan: 1,
      rowspan: 1,
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
