import { createStore } from '@ngneat/elf';
import {
  selectAllEntities,
  setEntities,
  withEntities,
} from '@ngneat/elf-entities';
import {
  createRequestsStatusOperator,
  initializeAsPending,
  updateRequestsStatus,
  withRequestsStatus,
} from '@ngneat/elf-requests';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, tap } from 'rxjs';

type Pokemon = {
  name: string;
};

export const pokemonStore = createStore(
  { name: 'pokemon' },
  withEntities<Pokemon, 'name'>({ idKey: 'name' }),
  withRequestsStatus<'pokemons'>(initializeAsPending('pokemons'))
);

export const setPokemons = (ps: Pokemon[]) => {
  pokemonStore.update(
    setEntities(ps),
    updateRequestsStatus(['pokemons'], 'success')
  );
};

export const trackPokemonsRequestStatus =
  createRequestsStatusOperator(pokemonStore);

export const injectElfLoadPokemons = (delayTime: number = 250) => {
  const http = inject(HttpClient);
  return http
    .get<{ results: Pokemon[] }>('https://pokeapi.co/api/v2/pokemon?limit=165')
    .pipe(
      delay(delayTime),
      tap((pokes) => setPokemons(pokes.results)),
      trackPokemonsRequestStatus('pokemons')
    );
};

export const elfPokemons$ = pokemonStore.pipe(selectAllEntities());

export const elfPokemonStatus$ = pokemonStore.pipe(
  map((store) => store.requestsStatus.pokemons.value)
);
