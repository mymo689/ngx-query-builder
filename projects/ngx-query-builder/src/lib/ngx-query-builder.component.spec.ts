import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxQueryBuilderComponent } from './ngx-query-builder.component';

describe('NgxQueryBuilderComponent', () => {
  let component: NgxQueryBuilderComponent;
  let fixture: ComponentFixture<NgxQueryBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxQueryBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxQueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
