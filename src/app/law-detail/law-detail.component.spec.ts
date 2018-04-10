import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawDetailComponent } from './law-detail.component';

describe('LawDetailComponent', () => {
  let component: LawDetailComponent;
  let fixture: ComponentFixture<LawDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
