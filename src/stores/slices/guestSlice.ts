import { type SliceState } from "../middlewares"

// create one type for the state - e.g. GuestState
export interface GuestState {
    readonly guests: Guest[],
}

export const initialGuestState: GuestState = {
    guests: []
};

// create one type for the actions - e.g. GuestActions
interface GuestActions {
    createGuest: (guests: Guest) => void,
    removeGuest: (guest: Guest) => void,
    updateGuest: (guest: Guest) => void,
    updateGuestActivity: (id: number, activity: GuestActivity) => void,
}

export interface GuestSlice extends GuestState, GuestActions { }

// export const createGuestSlice: SliceState<GuestSlice, GuestSlice> = (set) => ({
//     guests: [],
//     addGuests: (guests) => set(state => {
//         console.log(`adding ${guests.length} guests`)
//         state.guests.push(...guests)
//     }),
//     removeGuest: (guest) => set(state => { state.guests = state.guests.filter(g => g.id !== guest.id) }),
//     updateGuest: (guest) => set(state => {
//         state.guests = state.guests.map(g => g.id === guest.id ? guest : g)
//     }),
//     updateGuestActivity: (id, currentActivity) => set(state => {

//         state.guests = state.guests.map(g => {
//             return g.id === id ? { ...g, currentActivity } : g
//         })
//     })
// })