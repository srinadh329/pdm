import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'orderBy',
  pure: false
})
export class OrderByPipe implements PipeTransform {
  transform( array: Array<any>, orderField: string, orderType: boolean ): Array<string> {
    array = array || [];
    array.sort( ( a: any, b: any ) => {
    const ae = a[ orderField ];
    const be = b[ orderField ];
    if ( !ae && !be) { return 0; }
    if ( !ae && be ) { return orderType ? 1 : -1; }
    if ( ae && !be ) { return orderType ? -1 : 1; }
    if ( ae === be ) { return 0; }
    return orderType ? (ae.toString().toLowerCase() > be.toString().toLowerCase() ? -1 : 1)
    : (be.toString().toLowerCase() > ae.toString().toLowerCase() ? -1 : 1);
    } );
    return array;
    }

}
