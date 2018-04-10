import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-law',
  templateUrl: './law.component.html',
  styleUrls: ['./law.component.css']
})
export class LawComponent implements OnInit {
  PCode: string = "";
  attributes: Array<string> = [];
  data: any = {};
  english: any = {};

  chapters: Array<any> = [];
  articles: Array<any> = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private titleService: Title
  ) { }

  ngOnInit() {
    const dir = (location.hostname == "localhost") ? "./assets" : "";
    this.PCode = this.route.snapshot.paramMap.get("PCode");
    this.http.get(dir + `/mojLawSplitJSON/FalVMingLing/${this.PCode}.json`)
      .subscribe(data => {
        this.data = data;
        this.titleService.setTitle(data["法規名稱"]);

        for(let attr in data) this.attributes.push(attr);

        this.articles = data["法規內容"];
        this.articles.forEach(article => {
          if(article["編章節"]) {
            const raw = article["編章節"];
            const elem: any = {raw: raw};

            elem.type = raw.match(/[編章節款目]/)[0];
            elem.depth = "編章節款目".indexOf(elem.type);
            this.chapters.push(elem);
          }
        });

        if(data["是否英譯註記"] == "Y")
          this.http.get(dir + `/mojLawSplitJSON/Eng_FalVMingLing/${this.PCode}.json`)
            .subscribe(data => {
              data["chapters"] = [];
              data["法規內容"].forEach(article => {
                if(article["編章節"]) data["chapters"].push(article["編章節"]);
              });
              this.english = data;
            });
      });
  }

}
