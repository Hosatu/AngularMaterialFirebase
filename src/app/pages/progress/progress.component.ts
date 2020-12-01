import { Component, OnInit } from '@angular/core';
import { ProgressService } from '@shared/services';
import * as firebase from 'firebase';
import * as _ from 'lodash';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  public progressData;
  public _ = _;
  public sections = {
    'fonetika': ['úvod', 'výslovnost', 'vývoj', 'programování', 'zpracování řeči'],
    'morfologie': ['úvod', 'korpusy', 'statistika', 'programování', 'morfolog. analýza'],
    'syntax': ['grafy', 'úvod', 'konstituenty', 'typy konstituentů', 'synt. analýza'],
    'sémantika': ['úvod', 'význam']
  };
  public lessons = ['fonetika', 'morfologie', 'syntax', 'sémantika'];

  constructor(private progress: ProgressService) {
    this.progress.updated.subscribe(() => {
      this.progressData = this.progress.getProgress();
    });
  }

  getBlockIcon(block) {
    return block.finished ? 'done' : (block.unlocked ? 'lock_open' : 'lock');
  }

  getQuizIcon(quiz) {
    return quiz.points == 0 ? 'close' : 'done';
  }

  calculatePoints(lesson?, section?, quiz?): {max: number, current: number} {
    if (quiz && section && lesson) {
      const quizProgress = this.progressData[lesson].sections[section].quizResults[quiz];
      return { max: quizProgress.maxPoints, current: quizProgress.points };
    }
    if (section && lesson) {
      const sectionProgress = {
        max: 0, current: 0
      };
      for (const quizItem of _.keys(this.progressData[lesson].sections[section].quizResults)) {
        const quizData = this.calculatePoints(lesson, section, quizItem);
        sectionProgress.max += quizData.max;
        sectionProgress.current += quizData.current;
      }
      return sectionProgress;
    }
    if (lesson) {
      const lessonProgress = {
        max: 0, current: 0
      };
      for (const sectionItem of _.keys(this.progressData[lesson].sections)) {
        const sectionData = this.calculatePoints(lesson, sectionItem);
        lessonProgress.max += sectionData.max;
        lessonProgress.current += sectionData.current;
      }
      return lessonProgress;
    }
    const courseProgress = {
      max: 0, current: 0
    };
    for (const lessonItem of _.keys(this.progressData)) {
      const lessonData = this.calculatePoints(lessonItem);
      courseProgress.max += lessonData.max;
      courseProgress.current += lessonData.current;
    }
    return courseProgress;
  }

  pointsShow(points: {max: number, current: number}) {
    if (points.max == 0) {
      return '';
    }
    return '(Body: ' + points.current.toString() + '/' + points.max.toString() + ')';
  }

  isSectionUnlocked(lesson, section) {
    const progressData = this.progress.getProgress();
    return progressData && progressData[lesson] && progressData[lesson].sections[section] && progressData[lesson].sections[section].unlocked;
  }

  isLessonUnlocked(lesson) {
    const progressData = this.progress.getProgress();
    return progressData && progressData[lesson] && progressData[lesson].unlocked;
  }

  ngOnInit() {

  }

}
