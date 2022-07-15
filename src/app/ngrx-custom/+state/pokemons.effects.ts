import { Injectable } from '@angular/core';
import { pokemonDataLoaderSlice } from './pokemons.reducer';
import { PokemonsHttp } from '../../pokemons.http';
import { delay } from 'rxjs';

@Injectable()
export class PokemonsEffects {
  constructor(private client: PokemonsHttp) {}

  loadFun$ = pokemonDataLoaderSlice.createEffect(() =>
    this.client.getPokemonsList().pipe(delay(500))
  );
}
