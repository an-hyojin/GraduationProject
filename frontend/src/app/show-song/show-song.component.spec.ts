import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSongComponent } from './show-song.component';

describe('ShowSongComponent', () => {
  let component: ShowSongComponent;
  let fixture: ComponentFixture<ShowSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowSongComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
