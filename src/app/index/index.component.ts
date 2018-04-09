import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  laws: any = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const dir = (location.hostname == "localhost") ? "./assets" : "";
    this.http.get<Array<any>>(dir + "/mojLawSplitJSON/index.json").subscribe(data =>
      this.laws = data.sort((a, b) => b.lastUpdate - a.lastUpdate)
    );
  }
}
