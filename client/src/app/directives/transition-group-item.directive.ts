import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[app-transition-group-item]'
})
export class TransitionGroupItemDirective {
  public prevPos: any;
  public newPos: any;
  public el: HTMLElement;
  public moved: boolean = false;
  public moveCallback: any;

  constructor(elRef: ElementRef) {
    this.el = elRef.nativeElement;
  }
}
