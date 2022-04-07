export interface IDataField {
  text: string;
  type: 'array' | 'string' | 'number' | 'date' | 'boolean' | 'json';
  fieldName: string;
}
