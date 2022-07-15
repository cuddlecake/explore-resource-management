import {
  createFeatureSelector,
  createReducer,
  createSelector,
} from '@ngrx/store';
import {
  createDataLoaderSlice,
  LoadingStateModel,
} from '../createDataLoaderSlice';
import { PokemonNavItem } from '../../pokemon.model';

export const pokemonDataLoaderSlice = createDataLoaderSlice<
  PokemonNavItem[],
  any,
  'pokemons'
>('pokemons');

type StateModel = LoadingStateModel<PokemonNavItem[], any, 'pokemons'>;

export const pokemonsReducer = createReducer<StateModel>(
  {
    ...pokemonDataLoaderSlice.initialState(),
  },
  ...pokemonDataLoaderSlice.ons
);

export const pokemonsFeatureSelector =
  createFeatureSelector<StateModel>('pokemons');
export const selectPokemonsLoading = createSelector(
  pokemonsFeatureSelector,
  (state) => state.pokemonsLoading
);
export const selectPokemonsError = createSelector(
  pokemonsFeatureSelector,
  (state) => state.pokemonsError
);
export const selectPokemonsData = createSelector(
  pokemonsFeatureSelector,
  (state) => state.pokemonsData
);
