import { TestBed } from '@angular/core/testing';

import { BottomScrollDetectorService } from './bottom-scroll-detector.service';

describe('BottomScrollDetectorService', () => {
  let service: BottomScrollDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BottomScrollDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
