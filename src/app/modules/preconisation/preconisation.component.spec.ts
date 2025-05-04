import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreconisationComponent } from './preconisation.component';

describe('PreconisationComponent', () => {
  let component: PreconisationComponent;
  let fixture: ComponentFixture<PreconisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreconisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreconisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
