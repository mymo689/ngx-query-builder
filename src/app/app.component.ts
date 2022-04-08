import { Component } from '@angular/core';
import { Condition, Filter, IDataField, IElasticFilterGroup } from 'ngx-query-builder';

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
  newConditionList: Condition[] = [{
    text: 'Test Condition',
    shortCode: 'tst',
    usedFor: ['string','date'],
    usesValue2: true
  }];
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

  public filterChanged(filter: Filter): void {
    console.log('FC', filter);
  }

  public filterReset(): void {
    console.log('FR');
  }

  public queryExecuted(filterGroup: IElasticFilterGroup): void {
    console.log('QE', filterGroup);
  }

  public maxDepthReached(): void {
    console.log('MDR');
  }
}
