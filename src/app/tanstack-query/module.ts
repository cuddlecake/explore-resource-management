import { NgModule } from '@angular/core';
import {
  TanstackQueryPage,
  TanstackQueryPokemonPage,
} from './tanstack-query.page';
import { PokemonModule } from '../pokemon-components';
import { CommonModule } from '@angular/common';
import { routesForModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';

const navComponents = [TanstackQueryPage, TanstackQueryPokemonPage] as const;

@NgModule({
  imports: [
    CommonModule,
    PokemonModule,
    RouterModule.forChild(
      routesForModule(TanstackQueryPage, TanstackQueryPokemonPage)
    ),
    RouterModule.forChild(routesForModule(...navComponents)),
  ],
  declarations: [...navComponents],
  exports: [],
})
export class Module {}
