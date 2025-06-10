import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndEvalComponent } from './end-eval.component';

describe('EndEvalComponent', () => {
  let component: EndEvalComponent;
  let fixture: ComponentFixture<EndEvalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EndEvalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndEvalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
