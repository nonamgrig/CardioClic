import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitComponent } from './wait.component';

describe('WaitComponent', () => {
  let component: WaitComponent;
  let fixture: ComponentFixture<WaitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WaitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
