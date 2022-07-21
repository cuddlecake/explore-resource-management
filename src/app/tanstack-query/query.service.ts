import { inject, Injectable, InjectFlags, InjectionToken } from '@angular/core';
import {
  firstValueFrom,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import {
  notifyManager,
  QueryClient,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
} from '@tanstack/query-core';

export const QueryClientInjection = new InjectionToken<QueryClient>(
  'query client'
);

@Injectable({ providedIn: 'root' })
export class QueryService {
  private queryClient =
    inject(QueryClientInjection, InjectFlags.Optional) ?? new QueryClient();

  query<TData = unknown, TError = unknown>(
    key: string[],
    obs: Observable<TData>
  ): Observable<QueryObserverResult> {
    const options = this.queryClient.defaultQueryOptions({
      queryKey: key,
      queryFn: () => firstValueFrom(obs),
    });

    const observer = new QueryObserver(
      this.queryClient,
      this.queryClient.defaultQueryOptions(options)
    );

    return new Observable((obs) => {
      observer.subscribe(
        notifyManager.batchCalls(() => obs.next(observer.getCurrentResult()))
      );
    });
  }

  query$<TData = unknown, TError = unknown>(
    options: Observable<QueryObserverOptions>
  ): Observable<QueryObserverResult> {
    let queryObserver: QueryObserver;
    let firstDone = false;
    const resultObserver = (optimistic: any) =>
      new Observable((obs) => {
        obs.next(optimistic);
        queryObserver.subscribe(
          notifyManager.batchCalls(() => {
            obs.next(queryObserver.getCurrentResult());
          })
        );
      }).pipe(shareReplay({ bufferSize: 1, refCount: true }));

    const opts$ = options.pipe(
      map((opts) => this.queryClient.defaultQueryOptions(opts)),
      tap((opts) => {
        if (!firstDone) {
          queryObserver ??= new QueryObserver(this.queryClient, opts);
          firstDone = true;
        } else {
          queryObserver!.setOptions(opts, { listeners: false });
        }
      }),
      switchMap((opts) =>
        resultObserver(queryObserver.getOptimisticResult(opts))
      )
    );

    return opts$ as Observable<QueryObserverResult>;
  }
}

export const injectQuery: typeof QueryService.prototype.query = (...params) => {
  const queryService = inject(QueryService);
  return queryService.query(...params);
};

export const injectQuery$: typeof QueryService.prototype.query$ = (
  ...params
) => {
  const queryService = inject(QueryService);
  return queryService.query$(...params);
};
