import { Filter } from './models/filter.model';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Condition } from './models/condition.model';
import { IDataField } from './models/data-field.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ElasticFilterClause, IElasticFilterGroup } from './models/filter-request.model';

@Component({
  selector: 'ngx-qb',
  templateUrl: 'ngx-query-builder.component.html',
  styleUrls: ['ngx-query-builder.component.scss']
})
export class NgxQueryBuilderComponent implements OnInit, OnChanges, OnDestroy {
  private subscriptionList = new Subscription();

  @Input() filter: Partial<Filter> = {
    filterLevel: 1,
    id: 1,
    isGroupTF: true,
    clause: 'AND',
    value: null,
    value2: null,
    filters: []
  };
  @Input() dataFieldList: IDataField[] = [];

  @Output() filterChanged = new EventEmitter<Filter>();
  @Output() filterDeleted = new EventEmitter<number>();
  @Output() filterReset = new EventEmitter<any>();
  @Output() queryExecuted = new EventEmitter<IElasticFilterGroup>();

  public conditionList: Condition[] = [];
  public filterForm = new FormGroup({
    dataField: new FormControl(null, [Validators.required]),
    condition: new FormControl(null, [Validators.required]),
    value: new FormControl(null, [Validators.required]),
    value2: new FormControl(null),
  });
  public filterReady = false;

  public ngOnInit(): void {
    this.filter.filters!.forEach(filter => filter = new Filter(filter));
    if (this.filter.filters!.length > 1) {
      this.filter.filters!.sort((a, b) => (a.id! > b.id!) ? 1 : -1);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']?.firstChange) {
      if (this.filter.dataField) {
        this.conditionList = Condition.getFilteredCondition(this.filter.dataField.type);
      }
      this.filterForm.patchValue({
        dataField: changes['dataField']?.currentValue ?? this.filter.dataField,
        condition: changes['condition']?.currentValue ?? this.filter.condition,
        value: changes['value']?.currentValue ?? this.filter.value,
        value2: changes['value2']?.currentValue ?? this.filter.value2,
      });
      this.filterReady = true;
    }
  }

  public storeFormValues(): void {
    this.filter.dataField = this.filterForm.get('dataField')?.value;
    this.filter.condition = this.filterForm.get('condition')?.value;
    this.filter.value = this.filterForm.get('value')?.value;
    this.filter.value2 = this.filterForm.get('value2')?.value;
    this.filterChanged.emit(this.getFilterValue());
  }

  public getFilterValue(): Filter {
    return new Filter({
      filterLevel: this.filter.filterLevel,
      id: this.filter.id,
      isGroupTF: this.filter.isGroupTF,
      clause: this.filter.clause,
      dataField: this.filter.dataField,
      condition: this.filter.condition,
      value: this.filter.value,
      value2: this.filter.value2,
      filters: this.filter.filters
    });
  }

  public addFilterToList(isGroup: boolean): void {
    if (this.filter.filterLevel! >= 10) {
      // ! Limited at 10 levels deep
      return;
    }
    let newId = Date.now();
    this.filter.filters!.push(new Filter({
      filterLevel: this.filter.filterLevel! + 1,
      id: this.filter.filters!.some(filter => filter.id === newId) ? newId + Math.floor(Math.random() * 1000) : newId,
      clause: 'AND',
      isGroupTF: isGroup,
      filters: []
    }));
    this.filterChanged.emit(this.getFilterValue());
  }

  public compareFn(option1: IDataField | Condition, option2: IDataField | Condition): boolean {
    return option1?.text === option2?.text;
  }

  public dataFieldUpdated(dataField: any): void {
    if (this.filterReady) {
      this.conditionList = Condition.getFilteredCondition(dataField.type);
      // ! Reset condition, value, & value2 fields on dataField updated
      // this.filterForm.patchValue({
      //   condition: null,
      //   value: null,
      //   value2: null
      // });
      this.storeFormValues();
    }
  }

  public conditionUpdated(): void {
    if (this.filterReady) {
      // ! Reset value & value2 fields on condition updated
      // this.filterForm.patchValue({
      //   value: this.filterForm.controls.condition.value.staticValue ?? null,
      //   value2: null
      // });
      this.storeFormValues();
    }
  }

  public restrictInput(input: HTMLInputElement): void {
    input.value = input.value.replace(/([^a-zA-Z0-9\/\(\)\.])+/g, '');
  }

  public updateFilter(updatedFilter: Filter): void {
    this.storeFormValues();
    const oldFilterIndex = this.filter.filters!.findIndex(filter => filter.id === updatedFilter.id);
    this.filter.filters![oldFilterIndex] = {...updatedFilter};
    this.filterChanged.emit(this.getFilterValue());
  }

  public deleteFilter(filterID: number): void {
    this.filter.filters = this.filter.filters!.filter(filter => filter.id !== filterID);
    this.filterChanged.emit(this.getFilterValue());
  }

  public executeQuery(): void {
    this.queryExecuted.emit(this.prepFilters());
  }

  public prepFilters(subFilter?: Partial<Filter>): IElasticFilterGroup {
    if (!subFilter) {
      subFilter = this.filter;
    }
    let APIFilterObj: IElasticFilterGroup;
    if (subFilter.isGroupTF) {
      APIFilterObj = {
        boost: subFilter.boost,
        slop: subFilter.slop,
        filters: [],
        clause: ElasticFilterClause[subFilter.clause!]
      };
    } else {
      APIFilterObj = {
        dataField: subFilter.dataField?.fieldName,
        condition: subFilter.condition?.shortCode,
        value: subFilter.value,
        value2: subFilter.value2,
        boost: subFilter.boost,
        slop: subFilter.slop,
        filters: [],
        clause: ElasticFilterClause['NA']
      };
    }
    subFilter.filters?.forEach(filter => {
      APIFilterObj.filters.push(this.prepFilters(filter));
    });
    return APIFilterObj;
  }

  public resetFilter(): void {
    this.filter = {
      filterLevel: 1,
      id: 1,
      isGroupTF: true,
      clause: 'AND',
      value: null,
      value2: null,
      filters: []
    };
    this.filterReset.emit(this.filter);
  }

  public ngOnDestroy(): void {
    this.subscriptionList.unsubscribe();
  }
}
