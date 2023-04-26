// eslint-disable-next-line @typescript-eslint/ban-types
export type DeepPartial<T> = T extends Function
    ? T
    : T extends Array<infer InferredArrayMember>
    ? DeepPartialArray<InferredArrayMember>
    : T extends object
    ? DeepPartialObject<T>
    : T | undefined;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeepPartialArray<T> extends Array<DeepPartial<T>> { }

type DeepPartialObject<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};