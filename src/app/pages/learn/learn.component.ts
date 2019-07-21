import { Component, OnInit } from '@angular/core';
import { HasSubscriptions } from '@shared/utilities';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Section } from '../../shared/models';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent extends HasSubscriptions implements OnInit {

  public currentSection: Section;

  constructor(private route: ActivatedRoute, private files: HttpClient) {
    super();
    this.safeSubscribe<Params>(
      this.route.params,
      (params: Params) => {
        this.loadSection(params["lesson"], params["section"]);
      }
    );
  }

  private loadSection(lesson: string, section: string) {
    this.safeSubscribe(
      this.files.get("/assets/data/sections.json"),
      (fileContent) => {
        this.currentSection = fileContent[lesson][section];
      }
    );
  }

  ngOnInit() {
  }

}
