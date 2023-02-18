import {Component, ContentChildren, Input, QueryList} from '@angular/core';
import {TransitionGroupItemDirective} from "../../../directives/transition-group-item.directive";

@Component({
  selector: '[transition-group]',
  templateUrl: './transition-group.component.html',
  styleUrls: ['./transition-group.component.scss']
})
export class TransitionGroupComponent {
  @Input('transition-group') class: string = '';

  @ContentChildren(TransitionGroupItemDirective) items: QueryList<TransitionGroupItemDirective> = new QueryList<TransitionGroupItemDirective>();

  ngAfterViewInit() {
    setTimeout(() => this.refreshPosition('prevPos'), 0); // save init positions on next 'tick'

    this.items.changes.subscribe(items => {
      items.forEach((item: TransitionGroupItemDirective) => item.prevPos = item.newPos || item.prevPos);
      items.forEach(this.runCallback);
      this.refreshPosition('newPos');
      items.forEach((item: TransitionGroupItemDirective) => item.prevPos = item.prevPos || item.newPos); // for new items

      const animate = () => {
        items.forEach(this.applyTranslation);
        // @ts-ignore
        this['_forceReflow'] = document.body.offsetHeight; // force reflow to put everything in position
        this.items.forEach(this.runTransition.bind(this));
      }

      const willMoveSome = items.some((item: TransitionGroupItemDirective) => {
        const dx = item.prevPos.left - item.newPos.left;
        const dy = item.prevPos.top - item.newPos.top;
        return dx || dy;
      });

      if (willMoveSome) {
        animate();
      } else {
        setTimeout(() => { // for removed items
          this.refreshPosition('newPos');
          animate();
        }, 0);
      }
    })
  }

  runCallback(item: TransitionGroupItemDirective) {
    if (item.moveCallback) {
      item.moveCallback();
    }
  }

  runTransition(item: TransitionGroupItemDirective) {
    if (!item.moved) {
      return;
    }
    const cssClass = this.class + '-move';
    let el = item.el;
    let style: any = el.style;
    el.classList.add(cssClass);
    style.transform = style.WebkitTransform = style.transitionDuration = '';
    el.addEventListener('transitionend', item.moveCallback = (e: any) => {
      if (!e || /transform$/.test(e.propertyName)) {
        el.removeEventListener('transitionend', item.moveCallback);
        item.moveCallback = null;
        el.classList.remove(cssClass);
      }
    });
  }

  /*refreshPosition(prop: keyof TransitionGroupItemDirective) {
    this.items.forEach(item => {
      item[prop] = item.el.getBoundingClientRect();
    });
  }*/

  refreshPosition(prop: keyof TransitionGroupItemDirective) {
    this.items.forEach(item => {
      item[prop] = {
        top: item.el.offsetTop,
        left: item.el.offsetLeft
      }
    });
  }

  applyTranslation(item: TransitionGroupItemDirective) {
    item.moved = false;
    const dx = item.prevPos.left - item.newPos.left;
    const dy = item.prevPos.top - item.newPos.top;
    if (dx || dy) {
      item.moved = true;
      let style: any = item.el.style;
      style.transform = style.WebkitTransform = 'translate(' + dx + 'px,' + dy + 'px)';
      style.transitionDuration = '0s';
    }
  }
}
