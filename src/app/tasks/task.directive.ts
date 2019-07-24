import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[task]',
})
export class TaskDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
