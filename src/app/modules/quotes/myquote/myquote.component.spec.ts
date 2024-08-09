import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyquoteComponent } from './myquote.component';

describe('MyquoteComponent', () => {
  let component: MyquoteComponent;
  let fixture: ComponentFixture<MyquoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyquoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyquoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
