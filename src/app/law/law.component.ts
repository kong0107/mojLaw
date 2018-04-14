import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { LawService } from '../law.service';

@Component({
  selector: 'app-law',
  templateUrl: './law.component.html',
  styleUrls: ['./law.component.css']
})
export class LawComponent implements OnInit {
  PCode: string = "";
  version: string = "";
  lawContent: any = {};
  attributes: Array<string> = [];
  chapters: Array<any> = [];
  articles: Array<any> = [];

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private lawService: LawService
  ) { }

  ngOnInit() {
    const dir = (location.hostname == "localhost") ? "./assets" : "";
    this.PCode = this.route.snapshot.paramMap.get("PCode");
    this.version = this.route.snapshot.paramMap.get("version");

    this.lawService.getLaw(this.PCode).subscribe(data => {
      this.lawContent = data;
      this.titleService.setTitle(data["法規名稱"]);
      for(let attr in data) this.attributes.push(attr);

      this.articles = data["法規內容"].map(article => {
        if(article["編章節"]) {
          const raw = article["編章節"];
          const elem: any = {raw: raw};

          elem.type = raw.match(/[編章節款目]/)[0];
          elem.depth = "編章節款目".indexOf(elem.type);
          this.chapters.push(elem);
        }
        return article;
      });
    });
  }
}
