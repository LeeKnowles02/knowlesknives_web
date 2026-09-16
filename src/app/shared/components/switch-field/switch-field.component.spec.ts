import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitchFieldComponent } from './switch-field.component';

describe('SwitchFieldComponent', () => {
  let fixture: ComponentFixture<SwitchFieldComponent>;
  let component: SwitchFieldComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Visible on site');
    fixture.detectChanges();
  });

  it('shows the off state until a true value is written', () => {
    expect(component.checked).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('Off');

    component.writeValue(true);
    fixture.detectChanges();

    expect(component.checked).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('On');
  });

  it('emits the next boolean when the switch is toggled', () => {
    const changes: boolean[] = [];
    component.registerOnChange((value) => changes.push(value));

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(changes).toEqual([true]);
    expect(component.checked).toBeTrue();
  });
});
