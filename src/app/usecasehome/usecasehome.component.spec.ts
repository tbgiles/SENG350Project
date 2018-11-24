import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsecasehomeComponent } from './usecasehome.component';

describe('UsecasehomeComponent', () => {
  let component: UsecasehomeComponent;
  let fixture: ComponentFixture<UsecasehomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsecasehomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsecasehomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
