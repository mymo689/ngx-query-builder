export class Condition {
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
