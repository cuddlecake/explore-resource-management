import { Component, inject } from '@angular/core';
import { injectNameRouteParam } from '../app-routing.module';
import { injectQuery, injectQuery$, QueryService } from './query.service';
import { PokemonsHttp } from '../pokemons.http';
import {
  filter,
  firstValueFrom,
  interval,
  map,
  of,
  ReplaySubject,
  tap,
  timer,
} from 'rxjs';
import { PokemonNavItem } from '../pokemon.model';

@Component({
  selector: 'tanstack-query',
  template: `
    <pokemon-layout>
      <pokemon-nav
        *query="let result of pokemonsQuery"
        [loading]="result.status === 'loading'"
        [pokemons]="result.data ?? []"
      ></pokemon-nav>
    </pokemon-layout>
  `,
})
export class TanstackQueryPage {
  readonly pokemonsQuery = {
    queryKey: ['pokemons'],
    queryFn: () => firstValueFrom(this.pokemons.getPokemonsList()),
    onSuccess: (data: any) => console.log('success', data),
  };
  pokemonsQuery$ = of({
    queryKey: ['pokemons'],
    queryFn: () => firstValueFrom(this.pokemons.getPokemonsList()),
    onSuccess: (data: any) => console.log('success', data),
  });
  pokemons$ = injectQuery$(this.pokemonsQuery$).pipe(
    map((res) => res.data as PokemonNavItem[] | undefined)
  );
  pokemonsLoading$ = injectQuery(['pokemons']).pipe(
    map((res) => res.isLoading as boolean)
  );

  constructor(private pokemons: PokemonsHttp) {}
}

@Component({
  selector: 'tanstack-query-pokemon',
  template: `
    <ng-container *query="let pokemon of pokemons$ | async">
      <div *ngIf="pokemon.isLoading">Loading...</div>
      <pokemon-image
        *ngIf="pokemon.isSuccess"
        [pokemon]="pokemon.data"
      ></pokemon-image>
    </ng-container>
  `,
})
export class TanstackQueryPokemonPage {
  name$ = injectNameRouteParam();

  pokemonsHttp = inject(PokemonsHttp);

  pokemons$ = injectQuery$(
    of({
      queryKey: ['pokemons'],
      queryFn: () => firstValueFrom(this.pokemons.getPokemonsList()),
    })
  ).pipe(
    filter((res) => res.isSuccess),
    map((res) => res.data as PokemonNavItem[]),
    map((data) => ({
      queryKey: ['pokemon', data![5].name],
      staleTime: Number.MAX_SAFE_INTEGER,
      queryFn: () =>
        firstValueFrom(this.pokemonsHttp.getPokemonByName(data[5].name)),
    }))
  );

  pokemonQuery$ = this.name$.pipe(
    map((name) => ({
      queryKey: ['pokemon', name],
      staleTime: Number.MAX_SAFE_INTEGER,
      queryFn: () => firstValueFrom(this.pokemonsHttp.getPokemonByName(name)),
    }))
  );
  constructor(private pokemons: PokemonsHttp) {}

  pokemon$ = injectQuery$(
    this.name$.pipe(
      map((name) => ({
        queryKey: ['pokemon', name],
        staleTime: Number.MAX_SAFE_INTEGER,
        queryFn: () => firstValueFrom(this.pokemonsHttp.getPokemonByName(name)),
      }))
    )
  );
}
