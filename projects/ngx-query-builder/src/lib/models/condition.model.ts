export class Condition {
  public static fullList: Condition[] = [
    {
      text: 'contains',
      shortCode: 'cn',
      usedFor: ['array','string']
    },
    {
      text: 'does not contain',
      shortCode: 'ncn',
      usedFor: ['array','string']
    },
    {
      text: 'equal to',
      shortCode: 'eq',
      usedFor: ['array','string','number','date','boolean']
    },
    {
      text: 'not equal to',
      shortCode: 'neq',
      usedFor: ['array','string','number','date','boolean']
    },
    {
      text: 'greater than',
      shortCode: 'gt',
      usedFor: ['number','date']
    },
    {
      text: 'less than',
      shortCode: 'lt',
      usedFor: ['number','date']
    },
    {
      text: 'greater than or equal',
      shortCode: 'gte',
      usedFor: ['number','date']
    },
    {
      text: 'less than or equal',
      shortCode: 'lte',
      usedFor: ['number','date']
    },
    {
      text: 'empty',
      shortCode: 'em',
      usedFor: ['array','string','date'],
      staticValue: ''
    },
    {
      text: 'not empty',
      shortCode: 'nem',
      usedFor: ['array','string','date'],
      staticValue: ''
    },
    {
      text: 'between',
      shortCode: 'bt',
      usedFor: ['number','date'],
      usesValue2: true
    },
    {
      text: 'not between',
      shortCode: 'nbt',
      usedFor: ['number','date'],
      usesValue2: true
    },
    {
      text: 'query string',
      shortCode: 'qs',
      usedFor: ['array','string']
    },
    {
      text: 'starts with',
      shortCode: 'st',
      usedFor: ['string']
    },
    {
      text: 'ends with',
      shortCode: 'ew',
      usedFor: ['string']
    },
    {
      text: 'phrase match',
      shortCode: 'mmp',
      usedFor: ['string']
    },
    {
      text: 'regex',
      shortCode: 'rgx',
      usedFor: ['string']
    }
  ];

  static getFilteredCondition(use?: string): Condition[] {
    return use
      ? Condition.fullList.filter(condition => condition.usedFor.includes(use))
      : Condition.fullList;
  }

  text: string;
  shortCode: string;
  usedFor: string[];
  usesValue2?: boolean;
  staticValue?: any;

  constructor(init?: Partial<Condition>) {
    this.text = init?.text ?? '';
    this.shortCode = init?.shortCode ?? '';
    this.usedFor = init?.usedFor ?? [];
    this.usesValue2 = init?.usesValue2 ?? false;
    this.staticValue = init?.staticValue ?? null;
  }
}
