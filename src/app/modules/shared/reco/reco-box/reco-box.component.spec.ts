import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoBoxComponent } from './reco-box.component';

describe('RecoBoxComponent', () => {
  let component: RecoBoxComponent;
  let fixture: ComponentFixture<RecoBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecoBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
