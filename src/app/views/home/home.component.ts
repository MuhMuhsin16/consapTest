import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CountryService } from 'src/app/services/services-proxy';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface City {
  name: string;
}

export class Contact {
  name: string;
  email: string;
  address: string;
  country: string;
  city: string;
  zip: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  isLoadingAC: boolean = false;
  
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required,Validators.pattern(/^[0-9][0-9 -]*$/)]),
  });

  expandedElement: Contact | null;
  filteredOptions: Observable<City[]>;
  optionsCity = [];
  checkCountry: boolean = true;
  listContact: MatTableDataSource<Contact>
  columnsToDisplay = ['name', 'email', 'address', 'country', 'city', 'zip'];

  constructor(
    private _countryService: CountryService,
  ) { }

  get f() {
    return this.form.controls;
  }

  get hasDropDownError() {
    return (
      this.form.get('country').touched &&
      this.form.get('country').errors &&
      this.form.get('country').errors.required
    )
  }

  ngOnInit(): void {
    this.filteredOptions = this.form.controls['city'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.setValue('')
  }

  check(data) {
    console.log(data)
    this.filteredOptions
  }

  getCity(data) {
    this.isLoadingAC = true
    this.checkCountry = data !== "" ? false : true
    let params = {
      "order": "asc",
      "orderBy": "name",
      "country": data
    }
    this._countryService.getCityByCountry(params)
      .subscribe(
        response => {
          this.optionsCity = []
          response.data.forEach(element => {
            let dataCity = { name: '' }
            dataCity.name = element.city
            this.optionsCity.push(dataCity);
          });
          this.form.controls['city'].setValue('')
          this._filter(this.form.controls['city'].value)
          this.isLoadingAC = false
        },
        error => {
          console.log(error);
        });
  }

  displayFn(city: string): string {
    return city && city ? city : '';
  }

  private _filter(name: string): City[] {
    const filterValue = name.toLowerCase();

    return this.optionsCity.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listContact.filter = filterValue.trim().toLowerCase();

    if (this.listContact.paginator) {
      this.listContact.paginator.firstPage();
    }
  }

  setValue(params) {
    if (!params) {
      this.listContact = new MatTableDataSource()
      this.listContact.paginator = this.paginator;
      this.listContact.sort = this.sort;
    } else if (params) {
      let dataTest = new Contact;
        dataTest.name = params.name.value
        dataTest.address = params.address.value
        dataTest.city = params.city.value
        dataTest.country = params.country.value
        dataTest.email = params.email.value
        dataTest.zip = params.zip.value
        this.listContact.data.splice(0, 0, dataTest);
        this.listContact.paginator = this.paginator;
        this.listContact.sort = this.sort;
    }
  }

  submit() {
    debugger
    this.setValue(this.f)
  }
}
