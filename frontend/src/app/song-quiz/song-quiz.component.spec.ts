import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongQuizComponent } from './song-quiz.component';

describe('SongQuizComponent', () => {
  let component: SongQuizComponent;
  let fixture: ComponentFixture<SongQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});