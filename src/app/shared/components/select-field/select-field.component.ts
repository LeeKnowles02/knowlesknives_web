import {
  Component,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from '../../models/select-option.model';

@Component({
  selector: 'app-select-field',
  standalone: true,
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectFieldComponent),
      multi: true,
    },
  ],
})
export class SelectFieldComponent implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input({ required: true }) options: SelectOption[] = [];
  @Input() emptyLabel = 'All';
  @Input() allowEmpty = true;
  @Input() id = '';
  @Input() ariaLabel = '';

  open = signal(false);
  disabled = false;

  value = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.open.set(false);
    }
  }

  displayLabel(): string {
    if (this.allowEmpty && this.value === '') {
      return this.emptyLabel;
    }

    return this.options.find((option) => option.value === this.value)?.label ?? this.emptyLabel;
  }

  toggle(): void {
    if (this.disabled) {
      return;
    }

    this.open.update((isOpen) => !isOpen);
    if (this.open()) {
      this.onTouched();
    }
  }

  close(): void {
    this.open.set(false);
  }

  choose(optionValue: string): void {
    this.value = optionValue;
    this.onChange(optionValue);
    this.onTouched();
    this.close();
  }

  isSelected(optionValue: string): boolean {
    return this.value === optionValue;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open()) {
      return;
    }

    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
