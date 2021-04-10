import { Component, Input, OnInit, forwardRef, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CountryService } from '../services/services-proxy';

const noop = () => {
};
@Component({
    selector: 'dropdown-country',
    template:
        `<select class="form-select" aria-label="Default select"
            [(ngModel)]="inputValue"
            (ngModelChange)="selectedCountry.emit($event)">
                <option value="">Nothing Selected</option>
                <option *ngFor="let a of dataCountry" [value]="a.name">{{a.name}}</option>
        </select>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropdownCountryComponent),
            multi: true
        }
    ]
})
export class DropdownCountryComponent implements OnInit, ControlValueAccessor {

    @Output() selectedCountry: EventEmitter<string> = new EventEmitter<string>();
    @Input() labelKey = 'label';
    @Input() name = 'name';
    @Input() dataCountry;

    disabled = false;
    private innerValue: any = '';

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    constructor(private _countryService: CountryService,) { }

    ngOnInit(): void {
        this.getCountry()
    }

    getCountry(): void {
        this._countryService.getAllCountry()
            .subscribe(
                response => {
                    console.log(response);
                    this.dataCountry = response.data
                },
                error => {
                    console.log(error);
                });
    }

    get label() {
        return this.dataCountry ? this.dataCountry[this.labelKey] : 'Select...';
    }

    get inputValue(): any {
        return this.innerValue;
    }

    set inputValue(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    //From ControlValueAccessor interface
    writeValue(value: any): void {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

}