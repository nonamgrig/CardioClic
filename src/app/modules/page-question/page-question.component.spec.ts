import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageQuestionComponent } from './page-question.component';

describe('PageQuestionComponent', () => {
  let component: PageQuestionComponent;
  let fixture: ComponentFixture<PageQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
