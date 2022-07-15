import { Component, OnInit } from '@angular/core';
import { injectNameRouteParam } from '../app-routing.module';
import {
  elfPokemons$,
  elfPokemonStatus$,
  injectElfLoadPokemons,
} from './pokemon.repository';
import { concatMap, delay, timer } from 'rxjs';

@Component({
  selector: 'elf-page',
  template: `
    <pokemon-layout>
      <div class="loading" *ngIf="(pokemonsStatus$ | async) === 'pending'">
        Loading...
      </div>
      <pokemon-nav
        *ngIf="(pokemonsStatus$ | async) === 'success'"
        [pokemons]="(pokemons$ | async) ?? []"
      >
      </pokemon-nav
    ></pokemon-layout>
  `,
})
export class ElfPage implements OnInit {
  getPokemons$ = injectElfLoadPokemons();
  pokemons$ = elfPokemons$;
  pokemonsStatus$ = elfPokemonStatus$;

  ngOnInit() {
    this.getPokemons$.subscribe();
  }
}

@Component({
  selector: 'elf-pokemon-page',
  template: `elf-pokemon-page works for {{ name$ | async }}`,
})
export class ElfPokemonPage {
  name$ = injectNameRouteParam();
}
