import { type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { type Merge } from "react-hook-form";

// /** Additional utility type for typing the create() function. */
// type StateFromFunctions<T extends [...any]> = T extends [infer F, ...(infer R)]
//     ? F extends (...args: any) => object
//     ? StateFromFunctions<R> & ReturnType<F>
//     : unknown
//     : unknown;

/** Utility help for typing slices. Put the first value in for the complete state you're creating, and the second for the slice you need access to */
export type SliceState<TState, TSlice> = StateCreator<TState & TSlice, [["zustand/immer", never], ["zustand/devtools", never]], [], TState>


export type ExtractStateAndSlice<T> = T extends SliceState<infer TState, infer TSlice> ? [TState, TSlice] : never;

// create a type which takes in an array of types and creates a union of all of them
type UnionFromArray<T extends [...any]> = T extends [infer F, ...(infer R)]
    ? F | UnionFromArray<R>
    : never;

/**
 * A utility function that takes a `SliceState` function and returns a new function that applies the `devtools` and `immer` middlewares to it.
 *
 * @param f A `SliceState` function that defines the state slice and its initial state.
 * @returns A new function that applies the `devtools` and `immer` middlewares to the `SliceState` function.
 */
export const stateMiddlewares = <T extends [...any]>(f: SliceState<UnionFromArray<T>, T[0]>) => devtools(immer((f)))


