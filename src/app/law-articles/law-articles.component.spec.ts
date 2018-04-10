import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawArticlesComponent } from './law-articles.component';

describe('LawArticlesComponent', () => {
  let component: LawArticlesComponent;
  let fixture: ComponentFixture<LawArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawArticlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
