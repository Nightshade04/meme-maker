import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImageeditorPage } from './imageeditor.page';

describe('ImageeditorPage', () => {
  let component: ImageeditorPage;
  let fixture: ComponentFixture<ImageeditorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageeditorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageeditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
