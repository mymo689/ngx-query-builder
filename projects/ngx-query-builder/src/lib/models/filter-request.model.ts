import { Filter } from './filter.model';

export interface IFilterRequest {
  id: number;
  displayName: string;
  filter: IFilterRequestFilterObject;
  publicationIDs: string;
}

export interface IFilterRequestFilterObject {
  offset: number;
  limit: number;
  sort: string;
  sortDesc: boolean;
  filterByGroup: IElasticFilterGroup;
}

export interface IElasticFilter {
  dataField?: string;
  dataFields?: string[];
  condition?: string;
  value?: string;
  value2?: string;
  boost?: number;
  slop?: number;
  multiField?: string;
}

export interface IElasticFilterGroup extends IElasticFilter {
  filters: IElasticFilter[];
  clause: ElasticFilterClause;
}

export enum ElasticFilterClause {
  NA = 0,
  AND = 1,
  OR = 2
}
