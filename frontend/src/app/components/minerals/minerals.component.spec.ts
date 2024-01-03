import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MineralsComponent } from './minerals.component';

describe('MineralsComponent', () => {
  let component: MineralsComponent;
  let fixture: ComponentFixture<MineralsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MineralsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MineralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
