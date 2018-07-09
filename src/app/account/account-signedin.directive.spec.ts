import { AccountSignedinDirective } from './account-signedin.directive';
import { TestBed, inject } from '@angular/core/testing';

describe('AccountSignedinDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountSignedinDirective]
    });
  });

  it('should create an instance', inject([AccountSignedinDirective], (directive: AccountSignedinDirective) => {
    expect(directive).toBeTruthy();
  }));
});
