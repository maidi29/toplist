import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionGroupComponent } from './transition-group.component';

describe('TransitionGroupComponent', () => {
  let component: TransitionGroupComponent;
  let fixture: ComponentFixture<TransitionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransitionGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransitionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
