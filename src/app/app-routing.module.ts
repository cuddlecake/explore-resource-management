import { Component, inject, NgModule, Type } from '@angular/core';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

export const routesForModule = (Main: Type<any>, Child: Type<any>) => [
  {
    component: Main,
    path: '',
    children: [{ path: ':name', component: Child }],
  },
];

@Component({
  selector: 'picker',
  styles: [
    `
      a {
        color: #ccc;
      }
    `,
  ],
  template: `<main>
    <nav>
      <ul>
        <li *ngFor="let route of routes">
          <a [routerLink]="route">{{ route }}</a>
        </li>
      </ul>
    </nav>
  </main>`,
})
export class PickerComponent {
  readonly routes = ['ngrx-manual', 'ngrx-custom', 'elf', 'tanstack-query'];
  constructor() {}
}

const routes: Routes = [
  {
    path: 'ngrx-manual',
    loadChildren: () => import(`./ngrx-manual/module`).then((i) => i.Module),
  },
  {
    path: 'ngrx-custom',
    loadChildren: () => import('./ngrx-custom/module').then((i) => i.Module),
  },
  {
    path: 'elf',
    loadChildren: () => import('./elf/module').then((i) => i.Module),
  },
  {
    path: 'tanstack-query',
    loadChildren: () => import('./tanstack-query/module').then((i) => i.Module),
  },
  {
    path: '**',
    pathMatch: 'full',
    component: PickerComponent,
  },
];

export const injectNameRouteParam = () =>
  inject(ActivatedRoute).params.pipe(map((p: any) => p.name as string));

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  declarations: [PickerComponent],
  exports: [RouterModule],
})
export class AppRoutingModule {}
