export type ValuesOfObject<T> = T[keyof T];

export type KeysOfObject<T> = keyof T;

export type ValuesOfArray<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
