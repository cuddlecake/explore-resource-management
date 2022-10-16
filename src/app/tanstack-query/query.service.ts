import { inject, Injectable, InjectFlags, InjectionToken } from '@angular/core';
import { firstValueFrom, map, Observable, shareReplay } from 'rxjs';
import {
  notifyManager,
  parseQueryArgs,
  QueryClient,
  QueryKey,
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
    obs?: Observable<TData>
  ): Observable<QueryObserverResult> {
    const opts = parseQueryArgs(
      key,
      obs ? () => firstValueFrom(obs) : undefined
    );
    const defaultedQueryOptions = this.queryClient.defaultQueryOptions(opts);

    const observer = new QueryObserver(
      this.queryClient,
      this.queryClient.defaultQueryOptions(defaultedQueryOptions)
    );

    return new Observable((obs) => {
      observer.subscribe(
        notifyManager.batchCalls(() => obs.next(observer.getCurrentResult()))
      );
    });
  }

  query$<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: Observable<
      QueryObserverOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>
    >
  ): Observable<QueryObserverResult<TData, TError>> {
    const queryObserver = new QueryObserver<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >(this.queryClient, { enabled: false });

    const defaultedOpts = options.pipe(
      map((opts) => {
        const defaultedOpts = this.queryClient.defaultQueryOptions(opts);
        if (defaultedOpts.onError) {
          defaultedOpts.onError = notifyManager.batchCalls(
            defaultedOpts.onError
          );
        }
        if (defaultedOpts.onSuccess) {
          defaultedOpts.onSuccess = notifyManager.batchCalls(
            defaultedOpts.onSuccess
          );
        }
        if (defaultedOpts.onSettled) {
          defaultedOpts.onSettled = notifyManager.batchCalls(
            defaultedOpts.onSettled
          );
        }
        return defaultedOpts;
      })
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

  invalidateQueries = (
    ...params: Parameters<typeof this.queryClient.invalidateQueries>
  ) => {
    this.queryClient.invalidateQueries(...params);
  };
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
