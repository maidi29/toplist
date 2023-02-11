import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgDecorationComponent } from './bg-decoration.component';

describe('BgDecorationComponent', () => {
  let component: BgDecorationComponent;
  let fixture: ComponentFixture<BgDecorationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BgDecorationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgDecorationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
