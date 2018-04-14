import { Component, OnInit } from '@angular/core';
import { LawService } from '../law.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  updateDate: string = "";

  constructor(private lawService: LawService) { }

  ngOnInit() {
    this.lawService.get<string>("UpdateDate.txt")
      .subscribe(dateString => this.updateDate = dateString);
  }

}
