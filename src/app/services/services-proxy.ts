import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const countryBaseUrl = 'https://countriesnow.space/api/v0.1/countries';
const pokemonBaseUrl = 'https://pokeapi.co/api/v2/pokemon';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) { }

  getAllCountry(): Observable<any> {
    return this.http.get(countryBaseUrl+'/flag/images');
  }

  getCityByCountry(data): Observable<any> {
    return this.http.post(countryBaseUrl+'/population/cities/filter',data);
  }

}

@Injectable({providedIn: 'root'})
export class PokemonService {

  constructor(private http: HttpClient) { }

  getAllPokemon(): Observable<any> {
    return this.http.get(pokemonBaseUrl+'?limit=1118');
    // return this.http.get(CountryBaseUrl+'/flag/images');
  }

  getAllPokemonDetail(params): Observable<any> {
    return this.http.get(params);
  }
}

