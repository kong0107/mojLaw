import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { LawService } from '../law.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  lawList: any = [];

  filtered: any = [];
  settings = {
    query: ""
  };

  page: number = 0;
  pages: Array<number> = [];
  readonly itemsPerPage: number = 15;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private lawService: LawService
  ) { }

  filter() {
    // (input) 不像 oninput 有處理好中文輸入法的問題，只好延遲偵測了。
    window.setTimeout(()=> {
      const query = this.settings.query.trim();
      this.filtered = !query
          ? this.lawList
          : this.lawList.filter(law => {
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
    this.titleService.setTitle("法規查詢");
    this.settings.query = this.route.snapshot.paramMap.get("query") || "";

    this.lawService.getAll().subscribe(data => {
      this.lawList = data;
      this.filter();
    });
  }
}
