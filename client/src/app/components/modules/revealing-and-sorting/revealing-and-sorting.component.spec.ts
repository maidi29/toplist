import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevealingAndSortingComponent } from './revealing-and-sorting.component';

describe('SortingComponent', () => {
  let component: RevealingAndSortingComponent;
  let fixture: ComponentFixture<RevealingAndSortingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevealingAndSortingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevealingAndSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
