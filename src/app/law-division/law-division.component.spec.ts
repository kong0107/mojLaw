import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawDivisionComponent } from './law-division.component';

describe('LawDivisionComponent', () => {
  let component: LawDivisionComponent;
  let fixture: ComponentFixture<LawDivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawDivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
