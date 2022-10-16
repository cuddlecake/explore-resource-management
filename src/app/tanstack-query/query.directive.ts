import {
  Directive,
  DoCheck,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { QueryService } from './query.service';
import { Observable, ObservableInput, ReplaySubject } from 'rxjs';
import { QueryObserverResult } from '@tanstack/query-core';

type QueryContext<T> = {
  $implicit: QueryObserverResult<T>;
};

type ObservableInner<T extends Observable<unknown>> = T extends Observable<
  infer V
>
  ? V
  : never;

@Directive({ selector: '[query]' })
export class QueryDirective<T> implements OnInit {
  constructor(
    private vcr: ViewContainerRef,
    private tplRef: TemplateRef<any>,
    private queryService: QueryService
  ) {}

  static ngTemplateContextGuard<T>(
    dir: QueryDirective<T>,
    ctx: any
  ): ctx is QueryContext<T> {
    return true;
  }

  private queryOpts = new ReplaySubject<
    ObservableInner<Parameters<typeof QueryService.prototype.query$>[0]>
  >(1);

  @Input() set queryOf(opts: any) {
    this.queryOpts.next(opts);
    this.vcr.createEmbeddedView(this.tplRef, { $implicit: 'query' }, 0);
  }

  ngOnInit() {
    this.queryService.query$(this.queryOpts.asObservable()).subscribe((res) => {
      this.vcr.clear();
      this.vcr.createEmbeddedView(this.tplRef, { $implicit: res });
    });
  }
}
