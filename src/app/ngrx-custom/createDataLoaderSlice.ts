import { createAction, on, props, Store } from '@ngrx/store';
import { catchError, exhaustMap, map, Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

export type LoadingStateModel<T, E, Name extends string> = {
  [key in `${Name}Data`]?: T;
} & { [key in `${Name}Error`]?: E } & { [key in `${Name}Loading`]: boolean };

function createDataLoaderActions<T, E, Name extends string>(name: Name) {
  const loadAll = createAction(`[Loader/${name}] Load Data`);
  const loadAllSuccess = createAction(
    `[Loader/${name}] Load Data Success`,
    props<{ data: T }>()
  );
  const loadAllError = createAction(
    `[Loader/${name}] Load Data Error`,
    props<{ error?: E }>()
  );
  const clear = createAction(`[Loader/${name}] Clear Data`);
  return { loadAll, loadAllSuccess, loadAllError, clear };
}

export const createDataLoaderSlice = <T, E, Name extends string>(
  name: Name
) => {
  const actions = createDataLoaderActions<T, E, Name>(name);
  return {
    actions,
    createEffect: (
      loader: () => Observable<T>,
      errorTransform?: (error: any) => E
    ) => {
      const actions$ = inject(Actions);
      return createEffect(() =>
        actions$.pipe(
          ofType(actions.loadAll),
          exhaustMap(loader),
          map((data) => actions.loadAllSuccess({ data })),
          catchError((e) =>
            of(actions.loadAllError({ error: errorTransform?.(e) ?? e }))
          )
        )
      );
    },
    injectActions: () => {
      const store = inject(Store);
      return {
        load: () => store.dispatch(actions.loadAll()),
        clear: () => store.dispatch(actions.clear()),
      };
    },
    initialState: (initialData?: T) =>
      ({
        [`${name}Data`]: initialData,
        [`${name}Loading`]: false,
        [`${name}Error`]: undefined,
      } as LoadingStateModel<T, E, Name>),
    ons: [
      on<LoadingStateModel<T, E, Name>, [typeof actions.loadAll]>(
        actions.loadAll,
        (state) => {
          return {
            ...(state as any),
            [`${name}Loading`]: true,
          };
        }
      ),
      on<LoadingStateModel<T, E, Name>, [typeof actions.loadAllSuccess]>(
        actions.loadAllSuccess,
        (state, action) => ({
          ...(state as any),
          [`${name}Data`]: action.data,
          [`${name}Loading`]: false,
        })
      ),
      on<LoadingStateModel<T, E, Name>, [typeof actions.loadAllError]>(
        actions.loadAllError,
        (state, action) => {
          return {
            ...(state as any),
            [`${name}Error`]: action.error,
            [`${name}Loading`]: false,
          };
        }
      ),
    ],
  };
};
