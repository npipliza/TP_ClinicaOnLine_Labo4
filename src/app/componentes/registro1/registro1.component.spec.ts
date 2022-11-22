import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroImgsComponent } from './registro1.component';

describe('RegistroImgsComponent', () => {
  let component: RegistroImgsComponent;
  let fixture: ComponentFixture<RegistroImgsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroImgsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroImgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
