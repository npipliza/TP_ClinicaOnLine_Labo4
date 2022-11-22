import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogRegBaseComponent } from './log-reg-base.component';

describe('LogRegBaseComponent', () => {
  let component: LogRegBaseComponent;
  let fixture: ComponentFixture<LogRegBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogRegBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogRegBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
