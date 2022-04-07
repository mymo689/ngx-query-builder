import { Condition } from './condition.model';
import { IDataField } from './data-field.model';

export class Filter {
  filterLevel!: number;
  id!: number;
  isGroupTF = true;
  clause: 'NA' | 'AND' | 'OR' = 'AND';
  dataField?: IDataField;
  condition?: Condition;
  value: any = null;
  value2: any = null;
  filters: Partial<Filter>[] = [];
  boost = 1;
  slop = 5;

  constructor(init?: Partial<Filter>) {
    Object.assign(this, init);

    this.filters.forEach(filter => filter = new Filter(filter));
    if (this.filters.length > 1) {
      this.filters.sort((a, b) => (a.id! > b.id!) ? 1 : -1);
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
      filters: this.filters
    });
  }
}
