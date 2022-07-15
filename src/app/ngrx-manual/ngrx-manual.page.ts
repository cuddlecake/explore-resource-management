import { Component } from '@angular/core';
import { injectNameRouteParam } from '../app-routing.module';

@Component({
  selector: 'ngrx-manual-page',
  template: `
    <pokemon-layout
      ><pokemon-nav [pokemons]="[{ name: 'ditto' }]"></pokemon-nav
    ></pokemon-layout>
  `,
})
export class NgrxManualPage {}

@Component({
  selector: 'ngrx-manual-pokemon-page',
  template: `ngrx-manual-pokemon page works for {{ name$ | async }}`,
})
export class NgrxManualPokemonPage {
  name$ = injectNameRouteParam();
}
