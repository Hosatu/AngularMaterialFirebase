import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewChildren, QueryList, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HasSubscriptions } from '@shared/utilities';
import { HttpClient } from '@angular/common/http';
import { Section, Quiz } from '@shared/models';
import { TaskDirective } from 'src/app/tasks/task.directive';
import { TaskComponent } from 'src/app/tasks/task';
import { Tasks } from 'src/app/tasks/task.constants';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent extends HasSubscriptions implements OnInit {

  public currentSection: Section;
  public isLoading: boolean = true;
  @ViewChildren(TaskDirective) taskContainers: QueryList<TaskDirective>;

  constructor(public url: ActivatedRoute, public files: HttpClient, private componentFactoryResolver: ComponentFactoryResolver ) {
    super();
  }

  ngAfterViewInit() {
    this.safeSubscribe<Params>(
      this.url.params,
      (params: Params) => {
        this.isLoading = true;
        this.loadSection(params["lesson"], params["section"]);
      }
    )
  }

  private loadSection(lesson: string, section: string) {
    this.safeSubscribe(
      this.files.get("/assets/data/sections.json"),
      (fileContent) => {
        if(fileContent[lesson]) {
          this.currentSection = fileContent[lesson][section];
        } else {
          this.currentSection = null;
        }
        this.isLoading = false;
        setTimeout(() => this.loadAllTasks(this.currentSection.quizes));
      }
    )
    
  }

  private loadAllTasks(quizes: Quiz[]) {
    for(let quizIndex in quizes) {
      this.loadTask(this.taskContainers.toArray()[quizIndex].viewContainerRef, quizes[quizIndex]);
    }
  }

  private loadTask(viewContainerRef: ViewContainerRef, task: Quiz) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(Tasks[task.type]);
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<TaskComponent>componentRef.instance).data = task.data;
  }

  ngOnInit() {
  }

}
