import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HasSubscriptions } from '../../shared/utilities';
import { HttpClient } from '@angular/common/http';
import { Lesson } from '../../shared/models';
import { ProgressService } from '@shared/services';
import * as firebase from 'firebase';
@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent extends HasSubscriptions implements OnInit {

  public currentLesson: Lesson;
  public isLoading: boolean = true;

  constructor(private files: HttpClient, private route: ActivatedRoute, private progress: ProgressService) { 
    super();
    this.safeSubscribe<Params>(
      this.route.params,
      (params:Params) => {
        this.isLoading = true;
        this.loadLesson(params["lesson"]);
      }
    );
  }

  private loadLesson(lessonId: string) {
    this.safeSubscribe(
      this.files.get("/assets/data/lessons.json"),
      (fileContent) => {
        this.currentLesson = fileContent[lessonId];
        this.isLoading = false;
      }
    )
  }

  ngOnInit() {
  }

  isUnlocked(section) {
    const progressData = this.progress.getProgress();
    return progressData && progressData[this.currentLesson.id] && progressData[this.currentLesson.id].sections[section] && progressData[this.currentLesson.id].sections[section].unlocked;
  }

  isFinished(section) {
    const progressData = this.progress.getProgress();
    return progressData && progressData[this.currentLesson.id] && progressData[this.currentLesson.id].sections[section] && progressData[this.currentLesson.id].sections[section].finished;
  }
}
