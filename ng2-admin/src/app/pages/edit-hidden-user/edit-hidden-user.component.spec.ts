import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHiddenUserComponent } from './edit-hidden-user.component';

describe('EditUserComponent', () => {
  let component: EditHiddenUserComponent;
  let fixture: ComponentFixture<EditHiddenUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHiddenUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHiddenUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
