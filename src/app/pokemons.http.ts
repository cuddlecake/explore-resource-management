import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { PokemonNavItem } from './pokemon.model';

const pokemonNavListPath = () => 'https://pokeapi.co/api/v2/pokemon';
const pokemonPathByName = (name: string) =>
  `https://pokeapi.co/api/v2/pokemon/${name}`;

@Injectable({ providedIn: 'root' })
export class PokemonsHttp {
  constructor(private http: HttpClient) {}

  getPokemonsList() {
    return this.http
      .get<{ results: PokemonNavItem[] }>(pokemonNavListPath())
      .pipe(map((res) => res.results));
  }

  getPokemonByName(name: string) {
    return this.http.get<{}>(pokemonPathByName(name));
  }
}
