import { NgModule } from '@angular/core';
import { NgrxManualPage, NgrxManualPokemonPage } from './ngrx-manual.page';
import { PokemonModule } from '../pokemon-components';
import { CommonModule } from '@angular/common';
import { routesForModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';

const navComponents = [NgrxManualPage, NgrxManualPokemonPage] as const;

@NgModule({
  imports: [
    CommonModule,
    PokemonModule,
    RouterModule.forChild(
      routesForModule(NgrxManualPage, NgrxManualPokemonPage)
    ),
    RouterModule.forChild(routesForModule(...navComponents)),
  ],
  declarations: [...navComponents],
  exports: [],
})
export class Module {}
