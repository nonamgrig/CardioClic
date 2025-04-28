import { TestBed } from '@angular/core/testing';

import { TexteService } from './texte.service';

describe('TexteService', () => {
  let service: TexteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TexteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
