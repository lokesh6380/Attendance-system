import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedNavbar } from './shared-navbar';

describe('SharedNavbar', () => {
  let component: SharedNavbar;
  let fixture: ComponentFixture<SharedNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedNavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
