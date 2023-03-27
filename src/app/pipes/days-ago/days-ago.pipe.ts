import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'daysAgo',
  standalone: true
})
export class DaysAgoPipe implements PipeTransform {

  transform(value: string | Date): number {
    let parsedValue;

    if (value instanceof Date) parsedValue = value.toString();
    else parsedValue = value;

    const dateDiff = DateTime.fromISO(parsedValue).diffNow('days').days;
    const numberOfDays = Math.abs(Math.ceil(dateDiff));

    return Math.ceil(numberOfDays);
  }

}
