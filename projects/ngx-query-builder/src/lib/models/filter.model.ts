import { Condition } from './condition.model';
import { IDataField } from './data-field.model';

export class Filter {
  public static get NewTopLevelFilter(): Partial<Filter> {
    return new Filter({
      filterLevel: 1,
      id: 1,
      isGroupTF: true,
      clause: 'AND',
      value: null,
      value2: null,
      subFilters: []
    });
  }

  filterLevel!: number;
  id!: number;
  isGroupTF: boolean = true;
  clause: 'NA' | 'AND' | 'OR' = 'AND';
  dataField?: IDataField;
  condition?: Condition;
  value: any = null;
  value2: any = null;
  subFilters: Partial<Filter>[] = [];
  boost: number = 1;
  slop: number = 5;

  constructor(init?: Partial<Filter>) {
    Object.assign(this, init);
    this.subFilters.forEach(filter => filter = new Filter(filter));
    if (this.subFilters.length > 1) {
      this.subFilters.sort((a, b) => (a.id! > b.id!) ? 1 : -1);
    }
  }

  public getFilterValue(): Filter {
    return new Filter({
      filterLevel: this.filterLevel,
      id: this.id,
      isGroupTF: this.isGroupTF,
      clause: this.clause,
      dataField: this.dataField,
      condition: this.condition,
      value: this.value,
      value2: this.value2,
      subFilters: this.subFilters
    });
  }
}
