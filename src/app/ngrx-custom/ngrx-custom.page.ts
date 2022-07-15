import { Component, OnInit } from '@angular/core';
import { injectNameRouteParam } from '../app-routing.module';
import {
  pokemonDataLoaderSlice,
  selectPokemonsData,
  selectPokemonsError,
  selectPokemonsLoading,
} from './+state/pokemons.reducer';
import { select, Store } from '@ngrx/store';
import { startWith } from 'rxjs';

@Component({
  selector: 'ngrx-custom-page',
  template: `
    <pokemon-layout
      ><pokemon-nav
        [loading]="(pokemonsLoading$ | async) ?? true"
        [pokemons]="(pokemons$ | async) ?? []"
        [error]="pokemonsError$ | async"
      ></pokemon-nav
    ></pokemon-layout>
  `,
})
export class NgrxCustomPage implements OnInit {
  constructor(private store: Store) {}

  pokemonActions = pokemonDataLoaderSlice.injectActions();
  pokemons$ = this.store.pipe(select(selectPokemonsData));
  pokemonsLoading$ = this.store.pipe(
    select(selectPokemonsLoading),
    startWith(true)
  );
  pokemonsError$ = this.store.pipe(select(selectPokemonsError));

  ngOnInit() {
    this.pokemonActions.load();
  }
}

@Component({
  selector: 'ngrx-custom-pokemon-page',
  template: `ngrx-custom-pokemon page works for {{ name$ | async }}`,
})
export class NgrxCustomPokemonPage {
  name$ = injectNameRouteParam();
}
