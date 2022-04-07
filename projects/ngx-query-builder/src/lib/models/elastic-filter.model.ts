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
