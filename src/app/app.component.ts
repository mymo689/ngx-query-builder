import { Component } from '@angular/core';
import { Filter, IDataField } from 'ngx-query-builder';

@Component({
  selector: 'ngx-qb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  filter: Partial<Filter> = {
    filterLevel: 1,
    id: 1,
    isGroupTF: true,
    clause: 'AND',
    value: null,
    value2: null,
    subFilters: []
  };
  dataFieldList: IDataField[] = [
    {
      text: 'Author',
      type: 'string',
      fieldName: 'author'
    },
    {
      text: 'Title',
      type: 'string',
      fieldName: 'title'
    },
    {
      text: 'Date Published',
      type: 'date',
      fieldName: 'publishedDT'
    },
    {
      text: 'Copies Sold',
      type: 'number',
      fieldName: 'copiesSold'
    }
  ]

  filterChanged(x: any): void {
    console.log('FC', x);
  }

  filterReset(x: any): void {
    console.log('FR', x);
  }

  queryExecuted(x: any): void {
    console.log('QE', x);
  }
}
