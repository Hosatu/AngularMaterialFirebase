import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultichoiceComponent } from './multichoice.component';

describe('MultichoiceComponent', () => {
  let component: MultichoiceComponent;
  let fixture: ComponentFixture<MultichoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultichoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultichoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
