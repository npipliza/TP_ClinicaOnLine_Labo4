import { TestBed } from '@angular/core/testing';

import { NoEspecialistaGuard } from './no-especialista.guard';

describe('NoEspecialistaGuard', () => {
  let guard: NoEspecialistaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoEspecialistaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
