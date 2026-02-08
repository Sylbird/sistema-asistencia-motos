import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionAdmin } from './programacion-admin';

describe('ProgramacionAdmin', () => {
  let component: ProgramacionAdmin;
  let fixture: ComponentFixture<ProgramacionAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramacionAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramacionAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
