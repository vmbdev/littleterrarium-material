import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'daysAgo',
  standalone: true,
})
export class DaysAgoPipe implements PipeTransform {
  transform(value: string | Date, abs: boolean = true): number {
    let parsedValue;

    if (value instanceof Date) parsedValue = value.toString();
    else parsedValue = value;

    const dateDiff = DateTime.fromISO(parsedValue).diffNow('days').days;
    let numberOfDays = Math.ceil(dateDiff);

    if (abs) numberOfDays = Math.abs(numberOfDays);

    return Math.ceil(numberOfDays);
  }
}
