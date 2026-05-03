import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorService } from './instructor-service';

describe('InstructorService', () => {
  let component: InstructorService;
  let fixture: ComponentFixture<InstructorService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorService],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructorService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
