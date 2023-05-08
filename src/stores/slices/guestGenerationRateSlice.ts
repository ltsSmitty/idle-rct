export interface GuestGenerationRateState {
    /** The percent chance of generating a new guest each tick. 1 = 1%, 100 = 100%. A rate greater than 100 can generate more than 1 guest per tick. */
    readonly rate: number
}

export const initialGuestGenerationRateState: GuestGenerationRateState = {
    rate: 5,
}

interface GuestGenerationRateActions {
    increaseGuestGenerationRate: (incrementAmount: number) => void
}

export interface GuestGenerationRateSlice extends GuestGenerationRateState, GuestGenerationRateActions { }

// export const createGuestGenerationRateSlice: SliceState<GuestGenerationRateSlice, GuestGenerationRateSlice> = (set) => ({
//     guestGenerationRate: 1,
//     increaseGuestGenerationRate: (incrementAmount) => {
//         set((state) => {
//             state.guestGenerationRate += incrementAmount;
//         })
//     }
// })
