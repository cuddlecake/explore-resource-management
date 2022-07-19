import { Component, OnInit } from '@angular/core';
import { injectNameRouteParam } from '../app-routing.module';
import { QueryService } from './query.service';
import { PokemonsHttp } from '../pokemons.http';
import { map } from 'rxjs';
import { PokemonNavItem } from '../pokemon.model';

@Component({
  selector: 'tanstack-query',
  template: `
    <pokemon-layout
      ><pokemon-nav
        [loading]="(pokemonsLoading$ | async) ?? true"
        [pokemons]="(pokemons$ | async) ?? []"
      ></pokemon-nav
    ></pokemon-layout>
  `,
})
export class TanstackQueryPage implements OnInit {
  constructor(private query: QueryService, private pokemons: PokemonsHttp) {}

  pokemons$ = this.query
    .query(['pokemons'], this.pokemons.getPokemonsList())
    .pipe(map((res) => res.data as PokemonNavItem[] | undefined));

  pokemonsLoading$ = this.query
    .query(['pokemons'], this.pokemons.getPokemonsList())
    .pipe(map((res) => res.isLoading as boolean));

  ngOnInit() {
    this.pokemons$.subscribe(console.log);
  }
}

@Component({
  selector: 'tanstack-query-pokemon',
  template: `tanstack-query-pokemon page works for {{ name$ | async }}`,
})
export class TanstackQueryPokemonPage {
  name$ = injectNameRouteParam();
}
