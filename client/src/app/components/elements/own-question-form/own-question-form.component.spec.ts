import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnQuestionFormComponent } from './own-question-form.component';

describe('OwnQuestionFormComponent', () => {
  let component: OwnQuestionFormComponent;
  let fixture: ComponentFixture<OwnQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnQuestionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
