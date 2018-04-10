import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-law-articles',
  templateUrl: './law-articles.component.html',
  styleUrls: ['./law-articles.component.css']
})
export class LawArticlesComponent implements OnInit {
  PCode: string = '';
  articles: Array<any> = [];
  
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const dir = (location.hostname == "localhost") ? "./assets" : "";
    this.PCode = this.route.parent.snapshot.paramMap.get("PCode");
    this.http.get(dir + `/mojLawSplitJSON/FalVMingLing/${this.PCode}.json`)
      .subscribe(data => this.articles = data["法規內容"]);
  }
}
