import { TestBed } from '@angular/core/testing';

import { PreconisationService } from './preconisation.service';

describe('PreconisationService', () => {
  let service: PreconisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreconisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
