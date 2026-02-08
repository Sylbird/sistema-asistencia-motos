import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculosAdmin } from './vehiculos-admin';

describe('VehiculosAdmin', () => {
  let component: VehiculosAdmin;
  let fixture: ComponentFixture<VehiculosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculosAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiculosAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
