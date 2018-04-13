import { TestBed, inject } from '@angular/core/testing';

import { LawService } from './law.service';

describe('LawService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LawService]
    });
  });

  it('should be created', inject([LawService], (service: LawService) => {
    expect(service).toBeTruthy();
  }));
});
