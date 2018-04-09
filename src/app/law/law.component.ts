import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-law',
  templateUrl: './law.component.html',
  styleUrls: ['./law.component.css']
})
export class LawComponent implements OnInit {
  PCode: string = "";
  data: any = {};
  attributes = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    const dir = (location.hostname == "localhost") ? "./assets" : "";
    this.PCode = this.route.snapshot.paramMap.get("PCode");
    this.http.get(dir + `/mojLawSplitJSON/FalVMingLing/${this.PCode}.json`)
      .subscribe(data => {
        this.data = data;
        for(let attr in data) this.attributes.push(attr);
      });
  }

}
