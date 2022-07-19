import { inject, Injectable, InjectFlags, InjectionToken } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import {
  notifyManager,
  QueryClient,
  QueryObserver,
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
}
