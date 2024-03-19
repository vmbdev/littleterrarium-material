import { MockBuilder } from 'ng-mocks';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ShareService } from './share.service';

describe('ShareService', () => {
  beforeEach(() => {
    return MockBuilder(ShareService)
      .keep(HttpClientTestingModule)
  });

  it('should be created', () => {
    const service = ShareService;
    expect(service).toBeTruthy();
  });
});
