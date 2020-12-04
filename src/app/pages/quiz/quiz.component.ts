import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewChildren, QueryList, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HasSubscriptions } from '@shared/utilities';
import { HttpClient } from '@angular/common/http';
import { Section, Quiz } from '@shared/models';
import { TaskDirective } from 'src/app/tasks/task.directive';
import { TaskComponent } from 'src/app/tasks/task';
import { Tasks } from 'src/app/tasks/task.constants';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material';
import { ProgressService } from '@shared/services';
import * as firebase from 'firebase';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent extends HasSubscriptions implements OnInit {

  public currentSection: Section;
  public currentLesson: string;
  public currentSectionId: string;
  public isLoading = true;
  public slideDone: boolean[];
  public progressData;
  public _ = _;

  @ViewChildren(TaskDirective) taskContainers: QueryList<TaskDirective>;

  constructor(private snackBar: MatSnackBar, public url: ActivatedRoute, public files: HttpClient, private componentFactoryResolver: ComponentFactoryResolver, private progress: ProgressService ) {
    super();
  }

  ngAfterViewInit() {
    this.safeSubscribe<Params>(
      this.url.params,
      (params: Params) => {
        this.isLoading = true;
        this.loadSection(params['lesson'], params['section']);
        this.currentLesson = params['lesson'];
        this.currentSectionId = params['section'];
      }
    );
  }

  private loadSection(lesson: string, section: string) {
    this.safeSubscribe(
      this.files.get('/assets/data/sections.json'),
      (fileContent) => {
        if (fileContent[lesson]) {
          this.slideDone = new Array(fileContent[lesson][section].quizes.length).fill(false);
          this.currentSection = fileContent[lesson][section];
        } else {
          this.currentSection = null;
        }
        this.isLoading = false;
        setTimeout(() => this.loadAllTasks(this.currentSection.quizes));
      }
    );

  }

  private loadAllTasks(quizes: Quiz[]) {
    for (const quizIndex in quizes) {
      this.loadTask(this.taskContainers.toArray()[quizIndex].viewContainerRef, quizes[quizIndex], parseInt(quizIndex));
    }
  }

  preventDragOnMatching(index, e) {
    if (index < this.currentSection.quizes.length && this.currentSection.quizes[index].type == 'matching') {
      e.stopPropagation();
    }
  }

  private loadTask(viewContainerRef: ViewContainerRef, task: Quiz, index: number) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(Tasks[task.type]);
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.progress.updated.subscribe(() => {
      this.progressData = this.progress.getProgress();
      if(this.progressData ) {
        (<TaskComponent>componentRef.instance).progress = this.progressData[this.currentLesson].sections[this.currentSectionId].quizResults[index];
        if((<TaskComponent>componentRef.instance).progress && (<TaskComponent>componentRef.instance).progress.answer) {
          this.slideDone[index] = true;
        }
        componentRef.changeDetectorRef.detectChanges();
      }
    });
    (<TaskComponent>componentRef.instance).data = task.data;
    this.safeSubscribe(
      (<TaskComponent>componentRef.instance).taskSubmitted,
      (data: {points: number, answer: any}) => {
        console.log(task.data, data)
        if (this.slideDone.indexOf(false) != -1) {
          let newProgress = this.progress.getProgress();
          newProgress[this.currentLesson].sections[this.currentSectionId].quizResults[index] = {
            maxPoints: task.data.points,
            points: data.points,
            answer: data.answer
          };
          this.slideDone[this.slideDone.indexOf(false)] = true;
          if (this.allSlidesDone()) {
            newProgress = _.merge(
              newProgress,
            {
              [this.currentLesson]: {
                finished: this.currentLesson != this.currentSection.next[0],
                sections: {
                  [this.currentSectionId]: {
                    finished: true
                  }
                }
              }
            },
            {
              [this.currentSection.next[0]]: {
                unlocked: true,
                sections: {
                  [this.currentSection.next[1]]: {
                    unlocked: true
                  }
                }
              }
            });
          }
          this.progress.updateProgress(firebase.auth().currentUser.uid, newProgress);
        }
        if (data.points == task.data.points) {
          this.snackBar.open('Správná odpověď! ' + data.points + ' bod' + this.getInflection(data.points) + '.', 'Zavřít', {
            verticalPosition: 'bottom'
          });
        } else if (data.points == 0) {
          this.snackBar.open('Špatná odpověď! ' + data.points + ' bod' + this.getInflection(data.points) + '.', 'Zavřít', {
            verticalPosition: 'bottom'
          });
        } else {
          this.snackBar.open('Částečně správná odpověď! ' + data.points + ' bod' + this.getInflection(data.points) + '.', 'Zavřít', {
            verticalPosition: 'bottom'
          });
        }
      }
    );
  }

  getInflection(points: number) {
    console.log(points);
    return points === 1 ? '' : (points > 1 && points < 5 ? 'y' : 'ů');
  }

  public allSlidesDone() {
    return _.every(this.slideDone);
  }

  public slideUnlocked(index: number) {
    return index == 0 || this.slideDone[index - 1];
  }

  ngOnInit() {
  }

  getQuizIcon(quiz) {
    return quiz.points == 0 ? 'close' : 'done';
  }

  calculatePoints(lesson, section, quiz): {max: number, current: number} {
    const quizProgress = this.progressData[lesson].sections[section].quizResults[quiz];
    return { max: quizProgress.maxPoints, current: quizProgress.points };
  }

  pointsShow(points: {max: number, current: number}) {
    if (points.max == 0) {
      return '';
    }
    return '(Body: ' + points.current.toString() + '/' + points.max.toString() + ')';
  }

}
