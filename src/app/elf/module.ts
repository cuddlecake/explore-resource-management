import { NgModule } from '@angular/core';
import { PokemonModule } from '../pokemon-components';
import { CommonModule } from '@angular/common';
import { routesForModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';
import { ElfPage, ElfPokemonPage } from './elf.page';

const components = [ElfPage, ElfPokemonPage] as const;
@NgModule({
  imports: [
    CommonModule,
    PokemonModule,
    RouterModule.forChild(routesForModule(...components)),
  ],
  declarations: [...components],
  exports: [],
})
export class Module {}
