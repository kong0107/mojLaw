import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  laws: any = [];
  query: string = "";
  filtered: any = [];
  page: number = 0;
  pages: Array<number> = [];
  readonly itemsPerPage: number = 15;
  settings = {
    query: ""
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  filter() {
    // (input) 不像 oninput 有處理好中文輸入法的問題，只好延遲偵測了。
    window.setTimeout(()=> {
      const query = this.settings.query.trim();
      this.filtered = !query
          ? this.laws
          : this.laws.filter(law => {
            return (law.name.indexOf(query) >= 0);
          })
      ;

      this.page = 0;
      this.pages = [];
      for(let p = 0; p * this.itemsPerPage < this.filtered.length; ++p)
        this.pages.push(p);
    }, 100);
  }

  ngOnInit() {
    this.settings.query = this.route.snapshot.paramMap.get("query") || "";

    const dir = (location.hostname == "localhost") ? "./assets" : "";
    this.http.get<Array<any>>(dir + "/mojLawSplitJSON/index.json").subscribe(data => {
      this.laws = data.sort((a, b) => b.lastUpdate - a.lastUpdate);
      this.filter();
    });

    window["indexComponent"] = this;
  }
}
