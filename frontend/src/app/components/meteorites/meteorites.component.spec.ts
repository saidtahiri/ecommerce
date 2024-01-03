import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteoritesComponent } from './meteorites.component';

describe('MeteoritesComponent', () => {
  let component: MeteoritesComponent;
  let fixture: ComponentFixture<MeteoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeteoritesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeteoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
