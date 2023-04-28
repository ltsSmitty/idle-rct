import { create, type StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/** Utility help for typing slices. Put the first value in for the specific slice you're creating, and the second for the other slices */
type SliceState<T, U> = StateCreator<T & U, [["zustand/immer", never]], [], T>

/** Additional utility type for typing the create() function. */
type StateFromFunctions<T extends [...any]> = T extends [infer F, ...(infer R)]
    ? F extends (...args: any) => object
    ? StateFromFunctions<R> & ReturnType<F>
    : unknown
    : unknown;

// create one interface or type for the item - e.g. Guest

// create one type for the state - e.g. GuestState
interface GuestState {
    readonly guests: Guest[],
}

// create one type for the actions - e.g. GuestActions
interface GuestActions {
    addGuest: (guest: Guest) => void,
    removeGuest: (guest: Guest) => void,
    updateGuest: (guest: Guest) => void,
}

interface GuestSlice extends GuestState, GuestActions { }

interface GameState {
    readonly tick: number,
}

interface GameActions {
    incrementTick: () => void,
}

interface GameSlice extends GameState, GameActions { }

const createGameSlice: SliceState<GameSlice, GuestSlice> = (set) => ({
    tick: 0,
    incrementTick: () => {
        // upgrade the tick
        set(state => { state.tick += 1 });
    },
})


const createGuestSlice: SliceState<GuestSlice, GameSlice> = (set) => ({
    guests: [],
    addGuest: (guest) => set(state => { state.guests.push(guest) }),
    removeGuest: (guest) => set(state => { state.guests = state.guests.filter(g => g !== guest) }),
    updateGuest: (guest) => set(state => {
        state.guests = state.guests.map(g => g.id === guest.id ? guest : g)
    })
})

// type CombinedState = StateFromFunctions<[typeof createGameSlice, typeof createGuestSlice]>
// export const useBoundGameStore = create<CombinedState>()((...args) => ({...

export const useBoundGameStore = create<GameSlice & GuestSlice>()((...args) => ({
    ...createGameSlice(...args),
    ...createGuestSlice(...args),
}))

export const useBoundGameStoreImmer = create(immer<GameSlice & GuestSlice>((...args) => ({
    ...createGameSlice(...args),
    ...createGuestSlice(...args),
})))