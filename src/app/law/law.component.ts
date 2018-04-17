import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { LawService } from '../law.service';
import { LawContent } from '../law';

@Component({
  selector: 'app-law',
  templateUrl: './law.component.html',
  styleUrls: ['./law.component.css']
})
export class LawComponent implements OnInit {
  PCode: string = "";
  date: string = "";
  lawContent: any = {};
  attributes: Array<string> = [];
  chapters: Array<any> = [];
  articles: Array<any> = [];

  scrollToFragment() {
    const fragment = this.router.parseUrl(this.router.url).fragment;
    if(fragment) {
      const elem = document.getElementById(fragment);
      if(elem) elem.scrollIntoView(true);
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private lawService: LawService
  ) {
    /**
     * Workaround for router fragment issue of Angular
     * https://github.com/angular/angular/issues/13636#issuecomment-304825738
     */
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) this.scrollToFragment();
    });
  }

  ngOnInit() {
    this.route.paramMap.switchMap(params => {
      this.PCode = params.get("PCode");
      this.date = params.get("date");
      return this.lawService.loadLawHistory(this.PCode, this.date);
    }).subscribe(lawContent => {
      this.lawContent = lawContent;
      const version = lawContent.history[this.date || "newest"];
      this.titleService.setTitle(version["法規名稱"]);
      this.articles = version["法規內容"];
      this.chapters = this.articles
        .filter(article => article["編章節"])
        .map(article => {
          const raw = article["編章節"];
          const type = raw.match(/[編章節款目]/)[0];
          return {
            raw: raw,
            type: type,
            depth: "編章節款目".indexOf(type)
          };
        })
      ;
      //setTimeout(this.scrollToFragment(), 1000); //不成功？
      //window["lawComponent"] = this;
    });
  }
}
