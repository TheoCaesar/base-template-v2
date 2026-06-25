import { TestBed } from '@angular/core/testing';

import { FileMgtService } from './file-mgt.service';

describe('FileMgtService', () => {
  let service: FileMgtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileMgtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
