import { Component, inject, OnInit } from '@angular/core';
import { injectNameRouteParam } from '../app-routing.module';
import { injectQuery, injectQuery$, QueryService } from './query.service';
import { PokemonsHttp } from '../pokemons.http';
import { delay, firstValueFrom, map, takeUntil, timer } from 'rxjs';
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
export class TanstackQueryPage {
  constructor(private query: QueryService, private pokemons: PokemonsHttp) {}

  pokemons$ = injectQuery(['pokemons'], this.pokemons.getPokemonsList()).pipe(
    map((res) => res.data as PokemonNavItem[] | undefined)
  );

  pokemonsLoading$ = injectQuery(
    ['pokemons'],
    this.pokemons.getPokemonsList()
  ).pipe(map((res) => res.isLoading as boolean));
}

@Component({
  selector: 'tanstack-query-pokemon',
  template: `<ng-container *ngIf="pokemon$ | async as pokemonData">
    <div *ngIf="pokemonData.status === 'loading'">Loading...</div>
    <pokemon-image
      *ngIf="pokemonData.status === 'success'"
      [pokemon]="$any(pokemonData!.data)"
    ></pokemon-image
  ></ng-container>`,
})
export class TanstackQueryPokemonPage {
  constructor(private pokemonsHttp: PokemonsHttp) {}
  name$ = injectNameRouteParam();

  pokemon$ = injectQuery$(
    this.name$.pipe(
      map((name) => ({
        queryKey: ['pokemon', name],
        staleTime: 5000,
        refetchOnMount: false,
        queryFn: () => firstValueFrom(this.pokemonsHttp.getPokemonByName(name)),
      }))
    )
  );

  ngOnInit() {
    this.pokemon$
      .pipe(takeUntil(timer(5000)))
      .subscribe({ complete: () => console.log('complete') });
  }
}
