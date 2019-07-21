import { Subject, Observable, PartialObserver, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { OnDestroy } from "@angular/core";

export class HasSubscriptions implements OnDestroy {
  protected destroy$: Subject<void> = new Subject();

  protected safeSubscribe<T>(eventSource: Observable<T>, eventHandler:(value: T) => void): Subscription {
    return eventSource.pipe(
        takeUntil(this.destroy$)
    ).subscribe(eventHandler);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}