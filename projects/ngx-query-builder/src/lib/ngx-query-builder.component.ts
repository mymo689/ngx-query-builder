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
import { ElasticFilterClause, IElasticFilterGroup } from './models/elastic-filter.model';

@Component({
  selector: 'ngx-qb',
  templateUrl: 'ngx-query-builder.component.html',
  styleUrls: ['ngx-query-builder.component.scss']
})
export class NgxQueryBuilderComponent implements OnInit, OnChanges, OnDestroy {
  private subscriptionList = new Subscription();

  // Required Inputs
  @Input() dataFieldList: IDataField[] = [];

  // Optional Inputs
  @Input() filter: Partial<Filter> = Filter.NewTopLevelFilter;
  @Input() resetOnUpdate: boolean = false;
  @Input() maxFilterDepth: number = 10;

  // Outputs
  @Output() filterChanged = new EventEmitter<Filter>();
  @Output() filterDeleted = new EventEmitter<number>();
  @Output() filterReset = new EventEmitter();
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
    this.filter.subFilters!.forEach(filter => filter = new Filter(filter));
    if (this.filter.subFilters!.length > 1) {
      this.filter.subFilters!.sort((a, b) => (a.id! > b.id!) ? 1 : -1);
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
      subFilters: this.filter.subFilters
    });
  }

  public addFilterToList(isGroup: boolean): void {
    if (this.maxFilterDepth > 0 && this.filter.filterLevel! >= this.maxFilterDepth) {
      // TODO: emit letting the user know what happened
      return;
    }
    let newId = Date.now();
    this.filter.subFilters!.push(new Filter({
      filterLevel: this.filter.filterLevel! + 1,
      id: this.filter.subFilters!.some(filter => filter.id === newId) ? newId + Math.floor(Math.random() * 1000) : newId,
      clause: 'AND',
      isGroupTF: isGroup,
      subFilters: []
    }));
    this.filterChanged.emit(this.getFilterValue());
  }

  public compareFn(option1: IDataField | Condition, option2: IDataField | Condition): boolean {
    return option1?.text === option2?.text;
  }

  public dataFieldUpdated(dataField: any): void {
    if (this.filterReady) {
      this.conditionList = Condition.getFilteredCondition(dataField.type);
      if (this.resetOnUpdate) {
        // ! Reset condition, value, & value2 fields on dataField updated
        this.filterForm.patchValue({
          condition: null,
          value: null,
          value2: null
        });
      }
      this.storeFormValues();
    }
  }

  public conditionUpdated(): void {
    if (this.filterReady) {
      if (this.resetOnUpdate) {
        // ! Reset value & value2 fields on condition updated
        this.filterForm.patchValue({
          value: this.filterForm.get('condition')?.value.staticValue ?? null,
          value2: null
        });
      };
      this.storeFormValues();
    }
  }

  public restrictInput(input: HTMLInputElement): void {
    input.value = input.value.replace(/([^a-zA-Z0-9\/\(\)\.])+/g, '');
  }

  public updateFilter(updatedFilter: Filter): void {
    this.storeFormValues();
    const oldFilterIndex = this.filter.subFilters!.findIndex(filter => filter.id === updatedFilter.id);
    this.filter.subFilters![oldFilterIndex] = {...updatedFilter};
    this.filterChanged.emit(this.getFilterValue());
  }

  public deleteFilter(filterID: number): void {
    this.filter.subFilters = this.filter.subFilters!.filter(filter => filter.id !== filterID);
    this.filterChanged.emit(this.getFilterValue());
  }

  public executeQuery(): void {
    this.queryExecuted.emit(this.prepFilters(this.filter));
  }

  public prepFilters(filter: Partial<Filter>): IElasticFilterGroup {
    let APIFilterObj: IElasticFilterGroup;
    if (filter.isGroupTF) {
      APIFilterObj = {
        boost: filter.boost,
        slop: filter.slop,
        filters: [],
        clause: ElasticFilterClause[filter.clause!]
      };
    } else {
      APIFilterObj = {
        dataField: filter.dataField?.fieldName,
        condition: filter.condition?.shortCode,
        value: filter.value,
        value2: filter.value2,
        boost: filter.boost,
        slop: filter.slop,
        filters: [],
        clause: ElasticFilterClause['NA']
      };
    }
    filter.subFilters?.forEach(filter => {
      APIFilterObj.filters.push(this.prepFilters(filter));
    });
    return APIFilterObj;
  }

  public resetFilter(): void {
    this.filter = Filter.NewTopLevelFilter;
    this.filterReset.emit();
  }

  public ngOnDestroy(): void {
    this.subscriptionList.unsubscribe();
  }
}
