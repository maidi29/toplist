import {Component, OnDestroy, OnInit} from '@angular/core';
import {fadeIn} from "../../../util/animations";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [fadeIn]
})
export class ModalComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit(): void {
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.scrollY}px`;
  }

  ngOnDestroy(): void {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }

}
