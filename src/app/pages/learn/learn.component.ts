import { Component, OnInit } from '@angular/core';
import { HasSubscriptions } from '@shared/utilities';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Section } from '../../shared/models';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent extends HasSubscriptions implements OnInit {

  public currentSection: Section;
  public isLoading: boolean = true;

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private files: HttpClient) {
    super();
    this.safeSubscribe<Params>(
      this.route.params,
      (params: Params) => {
        this.isLoading = true;
        this.loadSection(params["lesson"], params["section"]);
      }
    );
  }

  private loadSection(lesson: string, section: string) {
    this.safeSubscribe(
      this.files.get("/assets/data/sections.json"),
      (fileContent) => {
        if(fileContent[lesson]) {
          fileContent[lesson][section].content.forEach((content, indexContent) => {
            content.text.forEach((text, indexText) => {
              fileContent[lesson][section].content[indexContent].text[indexText] = this.sanitizer.bypassSecurityTrustHtml(text);
            });
          });
          this.currentSection = fileContent[lesson][section];
        } else {
          this.currentSection = null;
        }
        this.isLoading = false;
      }
    );
  }

  ngOnInit() {
  }

}
