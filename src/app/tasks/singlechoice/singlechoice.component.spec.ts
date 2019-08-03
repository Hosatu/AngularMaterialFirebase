import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglechoiceComponent } from './singlechoice.component';

describe('SinglechoiceComponent', () => {
  let component: SinglechoiceComponent;
  let fixture: ComponentFixture<SinglechoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglechoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglechoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
