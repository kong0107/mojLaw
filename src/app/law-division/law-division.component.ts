import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-law-division',
  templateUrl: './law-division.component.html',
  styleUrls: ['./law-division.component.css']
})
export class LawDivisionComponent implements OnInit {
  @Input() list: any;
  @Input() depth: number = 0;

  constructor() { }

  ngOnInit() {
  }

}
