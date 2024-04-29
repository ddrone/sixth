export interface NumberValue {
  kind: 'number';
  value: number;
}

export interface FnPointerValue {
  kind: 'fnPointer';
  blockId: number;
  instrId: number;
}

export interface BoolValue {
  kind: 'boolean';
  value: boolean;
}

export type Value = NumberValue | FnPointerValue | BoolValue;
