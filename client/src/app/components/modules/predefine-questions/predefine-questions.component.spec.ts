import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefineQuestionsComponent } from './predefine-questions.component';

describe('PredefineQuestionsComponent', () => {
  let component: PredefineQuestionsComponent;
  let fixture: ComponentFixture<PredefineQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefineQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredefineQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
