import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IniciosComponent } from './inicios.component';

describe('IniciosComponent', () => {
  let component: IniciosComponent;
  let fixture: ComponentFixture<IniciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IniciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IniciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
