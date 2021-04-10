import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { element } from 'protractor';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PokemonService } from 'src/app/services/services-proxy';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export class DataTable {
  name: ''
  image: ''
  desc: any
}

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PokemonListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _pokemoneService: PokemonService,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }

  columnsToDisplay = ['name'];
  expandedElement: DataTable | null;
  dataSource = new MatTableDataSource([]);
  backupData = new MatTableDataSource([]);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.changeDetectorRefs.detectChanges();
    } else {
      this.changeDetectorRefs.detectChanges();
    }
  }

  ngOnInit(): void {
    this.getPokemon()
  }

  getPokemon() {
    let dataPokemon = [];
    // Get List Pokemon
    this._pokemoneService.getAllPokemon()
      .subscribe(
        response => {
          response.results.forEach(elementPokemon => {
            //Get Detail Pokemon
            this._pokemoneService.getAllPokemonDetail(elementPokemon.url)
              .subscribe(
                responseDetail => {
                  let data = new DataTable
                  data.name = responseDetail.name
                  data.image = responseDetail.sprites.other.dream_world.front_default
                  data.desc = responseDetail.name + 'has ' + responseDetail.types[0].type.name + ' type with '
                    + responseDetail.height + '0 cm for height and '
                    + this.numberWithCommas(responseDetail.weight) + ' kg for weigth';
                  dataPokemon.push(data)
                  this.dataSource = new MatTableDataSource(dataPokemon)
                  this.backupData = new MatTableDataSource(dataPokemon)
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                },
                error => {
                  console.log(error);
                });
          });
        },
        error => {
          console.log(error);
        });
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{1})+(?!\d))/g, ',');
  }

}
