import { NgModule } from '@angular/core';
import { NgrxCustomPage, NgrxCustomPokemonPage } from './ngrx-custom.page';
import { PokemonModule } from '../pokemon-components';
import { CommonModule } from '@angular/common';
import { routesForModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { pokemonsReducer } from './+state/pokemons.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PokemonsEffects } from './+state/pokemons.effects';

const navComponents = [NgrxCustomPage, NgrxCustomPokemonPage] as const;

@NgModule({
  imports: [
    CommonModule,
    PokemonModule,
    RouterModule.forChild(
      routesForModule(NgrxCustomPage, NgrxCustomPokemonPage)
    ),
    RouterModule.forChild(routesForModule(...navComponents)),
    StoreModule.forFeature('pokemons', pokemonsReducer),
    EffectsModule.forFeature([PokemonsEffects]),
  ],
  declarations: [...navComponents],
  exports: [],
})
export class Module {}
