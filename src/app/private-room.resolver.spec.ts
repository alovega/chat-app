import { TestBed } from '@angular/core/testing';

import { PrivateRoomResolver } from './private-room.resolver';

describe('PrivateRoomResolver', () => {
  let resolver: PrivateRoomResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PrivateRoomResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
