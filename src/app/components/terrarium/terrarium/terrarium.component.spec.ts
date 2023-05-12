import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from '@services/api.service';

import { TerrariumComponent } from './terrarium.component';

describe('TerrariumComponent', () => {
  let component: TerrariumComponent;
  let fixture: ComponentFixture<TerrariumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: ApiService }
      ],
      imports: [
        TerrariumComponent,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerrariumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
