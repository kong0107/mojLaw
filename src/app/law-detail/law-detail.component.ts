import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-law-detail',
  templateUrl: './law-detail.component.html',
  styleUrls: ['./law-detail.component.css']
})
export class LawDetailComponent implements OnInit {
  PCode: string = '';
  data: any = {};
  attributes: Array<string> = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const dir = (location.hostname == "localhost") ? "./assets" : "";
    this.PCode = this.route.parent.snapshot.paramMap.get("PCode");
    this.http.get(dir + `/mojLawSplitJSON/FalVMingLing/${this.PCode}.json`)
      .subscribe(data => {
        this.data = data;
        for(let attr in data) this.attributes.push(attr);
      });
  }
}
