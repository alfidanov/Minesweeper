import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    const minutes = Math.min(99, Math.floor(value / 60));
    const seconds = value % 60;

    const minutesString = String(minutes).padStart(2, '0');
    const secondsString = String(seconds).padStart(2, '0');

    return `${minutesString}:${secondsString}`;
  }

}
