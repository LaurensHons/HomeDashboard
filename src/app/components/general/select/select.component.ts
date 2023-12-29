import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatFormFieldAppearance,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  filter,
  startWith,
  takeUntil,
} from 'rxjs';
import { MatOption } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { v4 } from 'uuid';

export class SelectOption<T> {
  id!: any;
  name!: string;
  obj!: T;
}

@Directive({
  selector: '[appValueControl]',
  standalone: true,
})
export class ValueDirective {
  @Input() optionValueAccessor: (option: any) => any = (o) => o;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    ScrollingModule,
  ],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => SelectComponent),
    },
  ],
})
export class SelectComponent<T>
  implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy
{
  @Input() label?: string;
  @Input() placeholder?: string;

  @Input() hideSearch = false;
  @Input() clearButton = true;
  @Input() selectAllButton = false;
  @Input() hideSubscript = true;
  @Input() multiple = false;
  @Input() required = false;
  @Input() noResultsText = 'No results';

  @Input() navColor?: string;
  @Input() navContrast?: string;
  @Input() appearance: 'fill' | 'outline' = 'outline';
  @Input() optionHeight = 40;
  @Input() optionCount = 5;

  @Input() optionSearchKeys?: string[];
  @Input() optionFilter?: (a: T, b: string) => boolean;
  @Input() optionSort?: (a: T, b: T) => number;

  @Input() options: T[] | undefined | null = [];
  @Input() optionValueKey?: string;
  @Input() optionDisplayValueKey = 'name';
  @Input() optionValueAccessor?: (option: T) => any;
  @Input() optionDisplayValueAccessor?: (option: T) => string;
  @Input() optionTemplate?: TemplateRef<T>;
  @Input() additonalTemplate?: TemplateRef<T>;

  @Input() debug = false;

  @Output() focusUinput = new EventEmitter<void>();
  @Output() openedChange = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<MatSelectChange>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('dropdownFilter') dropdownFilter!: ElementRef;
  @ViewChildren(MatOption) dropdownOptions!: QueryList<MatOption>;

  private id = v4();
  form = new FormControl<any | null>(null);
  searchFormControl = new FormControl('');

  onChange?: (val: any) => any;
  onTouched?: () => any;
  touched = false;
  disabled = false;

  filteredOptions: BehaviorSubject<SelectOption<T>[]> = new BehaviorSubject<
    SelectOption<T>[]
  >([]);
  filteredOptionsSelected: BehaviorSubject<SelectOption<T>[]> =
    new BehaviorSubject<SelectOption<T>[]>([]);
  filteredOptionsUnselected: BehaviorSubject<SelectOption<T>[]> =
    new BehaviorSubject<SelectOption<T>[]>([]);

  destroy$ = new Subject<void>();

  constructor(private elementRef: ElementRef) {
    this.optionSort =
      this.optionSort ??
      ((a, b) => {
        const aName = this.itemDisplayValue(a);
        const bName = this.itemDisplayValue(b);
        return aName?.toString().localeCompare(bName as string);
      });

    this.optionFilter =
      this.optionFilter ??
      ((obj, value) => {
        if ((this.searchFormControl.value?.trim() || '') === '') return true;
        if (this.optionSearchKeys != null)
          return (
            (this.searchFormControl.value?.trim() || '') === '' ||
            this.optionSearchKeys!.some((key) =>
              (obj as any)[key]
                ?.toLowerCase()
                .includes(this.searchFormControl.value?.toLowerCase())
            )
          );
        const display = this.itemDisplayValue(obj);
        return display?.toString().toLowerCase().includes(value);
      });
  }

  writeValue(obj: any): void {
    this.form.setValue(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    if (this.form.disabled && !isDisabled) this.form.enable();
    else if (!this.form.disabled && isDisabled) this.form.disable();
  }
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return control.validator?.(this.form) || null;
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.form.valueChanges.subscribe(fn);
  }

  ngOnInit(): void {
    this.searchFormControl.valueChanges
      .pipe(startWith(''), takeUntil(this.destroy$))
      .subscribe(() => this.filterOptions());

    if (this.debug)
      this.form.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((v) => console.log(v));

    combineLatest([
      this.form.valueChanges.pipe(startWith('')),
      this.filteredOptions,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([value, options]) => {
        const filtered = options.reduce(
          (acc, cur) => {
            if (
              (Array.isArray(value) &&
                (value as any[]).some((v) => v === cur.id)) ||
              JSON.stringify(value) === JSON.stringify(cur.id)
            ) {
              acc.selected.push(cur);
            } else {
              acc.unselected.push(cur);
            }
            return acc;
          },
          {
            selected: [] as SelectOption<T>[],
            unselected: [] as SelectOption<T>[],
          }
        );

        if (this.debug) console.log('split', filtered, 'value', value);

        this.filteredOptionsSelected.next(
          filtered?.selected.sort((a, b) => this.optionSort!(a.obj, b.obj)) ||
            []
        );
        this.filteredOptionsUnselected.next(
          filtered?.unselected.sort((a, b) => this.optionSort!(a.obj, b.obj)) ||
            []
        );
      });

    if (this.navColor)
      this.elementRef.nativeElement.style.setProperty(
        '--nav-color',
        this.navColor ?? '#fff'
      );
    if (this.navContrast)
      this.elementRef.nativeElement.style.setProperty(
        '--nav-contrast',
        this.navContrast ?? '#000'
      );

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `.${this.panelClassName} { max-height: ${this.panelHeight}px !important; padding: 0 !important; }`;
    document.getElementsByTagName('head')[0].appendChild(style);

    this.elementRef.nativeElement.style.setProperty(
      `--${this.id}-panel-height`,
      this.panelHeight?.toString()
    );
    document.documentElement.style.setProperty(
      `--${this.id}-item-height`,
      this.optionHeight?.toString()
    );
  }

  get panelClassName() {
    return `select-panel-${this.id}`;
  }

  get panelHeight() {
    return (
      this.optionHeight * this.optionCount +
      (this.multiple && this.selectAllButton ? 36 : 0) +
      (this.hideSearch ? 0 : 48)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const hasChanges = (key: string) =>
      changes[key] &&
      changes[key].currentValue !== changes[key].previousValue &&
      !changes[key].isFirstChange();
    if (hasChanges('options')) {
      this.filterOptions();
    }
  }

  itemValue(item: T) {
    if (this.optionValueAccessor) return this.optionValueAccessor(item);
    if (this.optionValueKey) return (item as any)[this.optionValueKey];
    return item;
  }

  itemDisplayValue(item: T): string {
    if (this.optionDisplayValueAccessor)
      return this.optionDisplayValueAccessor(item);
    if (this.optionDisplayValueKey)
      return (item as any)[this.optionDisplayValueKey];
    return item?.toString() || '';
  }

  selectAll() {
    this.form.setValue(
      this.options?.map((o) => this.itemValue(o)) as unknown as null
    );
  }

  filterOptions() {
    const filtered = this.options
      ?.filter((t, i) =>
        this.optionFilter!(t, this.searchFormControl.value || '')
      )
      .map((option) => ({
        id: this.itemValue(option),
        name: this.itemDisplayValue(option),
        obj: option,
      }));
    if (this.debug)
      console.log(
        'filtered',
        filtered,
        'options',
        this.options,
        'value:',
        this.searchFormControl.value
      );
    this.filteredOptions.next(filtered || []);
  }

  onOpened() {
    this.openedChange.emit();
    this.dropdownFilter?.nativeElement.focus();
  }

  onSelectionChange(e: MatSelectChange) {
    this.selectionChange.emit(e);
    this.onChange?.(this.form.value);
    if (this.debug) console.log('selection change', e);
  }

  onClosed() {
    this.closed.emit();
    this.searchFormControl.setValue(null);
  }

  selectFirstOption() {
    this.dropdownOptions.first.focus();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
