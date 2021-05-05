import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ms-timer',
  templateUrl: './ms-timer.component.html',
  styleUrls: ['./ms-timer.component.scss']
})
export class MsTimerComponent implements OnInit {

  @Input() time: number;

  constructor() { }

  ngOnInit(): void {
  }

  public getFormattedTime(value: number): any {
    value = Math.min(value, 999);
    return String(value).padStart(3, '0');
  }

}
