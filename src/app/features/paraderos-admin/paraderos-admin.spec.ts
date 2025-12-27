import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaderosAdmin } from './paraderos-admin';

describe('ParaderosAdmin', () => {
  let component: ParaderosAdmin;
  let fixture: ComponentFixture<ParaderosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParaderosAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ParaderosAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
