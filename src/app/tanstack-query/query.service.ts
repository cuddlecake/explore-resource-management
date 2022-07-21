import { inject, Injectable, InjectFlags, InjectionToken } from '@angular/core';
import {
  combineAll,
  combineLatest,
  combineLatestAll,
  concat,
  concatMap,
  distinctUntilChanged,
  first,
  firstValueFrom,
  map,
  merge,
  mergeAll,
  Observable,
  share,
  shareReplay,
  skip,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  DefaultedQueryObserverOptions,
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

  query$<TQueryFn, TError = unknown, TData = unknown>(
    options: Observable<QueryObserverOptions<TQueryFn, TError, TData>>
  ): Observable<QueryObserverResult<TData, TError>> {
    const queryObserver = new QueryObserver<TQueryFn, TError, TData>(
      this.queryClient,
      { enabled: false }
    );

    const defaultedOpts = options.pipe(
      map((opts) => this.queryClient.defaultQueryOptions(opts))
    );

    const resultsObserver$ = new Observable<QueryObserverResult<TData, TError>>(
      (obs) => {
        const unsub = queryObserver.subscribe(
          notifyManager.batchCalls(() =>
            obs.next(queryObserver.getCurrentResult())
          )
        );
        const optsSub = defaultedOpts.subscribe((opts) => {
          queryObserver.setOptions(opts, { listeners: true });
        });
        return () => {
          optsSub.unsubscribe();
          unsub();
        };
      }
    );

    return resultsObserver$.pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
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
