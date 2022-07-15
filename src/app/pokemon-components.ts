import {
  Component,
  Input,
  NgModule,
  Pipe,
  PipeTransform,
  ViewEncapsulation,
} from '@angular/core';
import { Pokemon, PokemonNavItem } from './pokemon.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'pokemon',
  styles: [
    `
      img {
        filter: drop-shadow(0 0 1.25rem #ccc) drop-shadow(0 0 2.5rem skyblue);
      }
    `,
  ],
  template: `<img
    *ngIf="pokemon"
    [src]="pokemon.sprites.other['official-artwork'].front_default | safe"
    alt
  />`,
})
export class PokemonImage {
  @Input() pokemon?: Pokemon = undefined;
}

@Component({
  selector: 'pokemon-nav',
  template: `
    <div *ngIf="loading">Loading...</div>
    <nav *ngIf="!loading && !error">
      <ul>
        <li *ngFor="let pokemon of pokemons">
          <a [routerLink]="pokemon.name">{{ pokemon.name }}</a>
        </li>
      </ul>
    </nav>
    <div *ngIf="!loading && error">Error :(</div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class PokemonNav {
  @Input() error?: any = undefined;
  @Input() loading?: boolean = false;
  @Input() pokemons?: PokemonNavItem[] = [];
}

@Pipe({ name: 'safe', pure: true })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }
}

@Component({
  selector: 'pokemon-layout',
  template: `<div class="layout">
    <ng-content select="pokemon-nav, div.loading"></ng-content>
    <main>
      <router-outlet></router-outlet>
    </main>
  </div>`,
  styles: [
    `
      .layout {
        height: 100%;
        width: 100%;
        display: grid;
        column-gap: 8px;
        grid-template-columns: 200px 1fr;
        grid-template-rows: 100%;
      }

      :host {
        color: #ccc;
      }

      ::ng-deep nav {
        overflow-y: scroll;
        height: 100%;
        ul {
          display: flex;
          margin: 0;
          flex-direction: column;
          list-style: none;
          padding: 0;
          li {
            transition: box-shadow 125ms ease-in-out,
              background-color 100ms ease-in-out;
            &:hover {
              background-color: #444444;
            }
            &:focus-within {
              box-shadow: inset 0px 0px 0px 1px skyblue;
            }
            width: 100%;
            height: 100%;
            a:focus {
              outline: none;
            }
            a {
              color: #ccc;
              text-transform: capitalize;
              display: block;
              padding: 8px 12px;
              text-align: start;
              text-decoration: none;
            }
          }
        }
      }
    `,
  ],
})
export class PokemonLayoutComponent {}

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [PokemonNav, PokemonImage, SafePipe, PokemonLayoutComponent],
  exports: [PokemonLayoutComponent, PokemonNav, PokemonImage],
})
export class PokemonModule {}
