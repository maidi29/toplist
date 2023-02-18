import { trigger, style, animate, transition,} from '@angular/animations';

export const fadeIn =
  trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.9)' }),
      animate('250ms', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
    ]),
  ]);
