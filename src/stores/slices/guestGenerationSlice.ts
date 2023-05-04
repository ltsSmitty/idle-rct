
import { type GuestGenerationStatsSlice } from "./guestGenerationStatsSlice";
import { create } from "zustand";
import { stateMiddlewares, SliceState } from '../middlewares';
import generateGuest from "~/game/gameplay/generateGuests";

export interface GuestGenerationState {
    guestGenerationLocation: CoordsXYZ;
    nextGuestId: number;
    newlyGeneratedGuests: Guest[];
}

export const initialGuestGenerationState: GuestGenerationState = {
    guestGenerationLocation: { x: 0, y: 0, z: 0 },
    nextGuestId: 0,
    newlyGeneratedGuests: [],
}

interface GuestGenerationActions {
    generateGuest: () => void;
    // generateGuests: (count: number) => void;
    updateGuestGenerationLocation: (location: CoordsXYZ) => void;
}

interface GuestGenerationSlice extends GuestGenerationState, GuestGenerationActions { }



// const createGenerateGuestSlice: SliceState<GuestGenerationSlice, GuestGenerationStatsSlice> = (set) => ({
//     nextGuestId: 0,
//     guestGenerationLocation: { x: 0, y: 0, z: 0 },
//     newlyGeneratedGuests: [],
//     generateGuest: () => {
//         set((state) => {
//             state.newlyGeneratedGuests = [];
//             const guest: Guest = generateGuest(
//                 {
//                     guestGenerationLocation: state.guestGenerationLocation,
//                     guestStats: guestGenerationStats,
//                     nextGuestId: state.nextGuestId,
//                     // TODO hook into the starting activity, wherever that is
//                     startingActivity: undefined
//                 });
//             state.nextGuestId += 1;
//             state.newlyGeneratedGuests.push(guest);
//         })
//     },
//     updateGuestGenerationLocation: (location) => {
//         set((state) => {
//             state.guestGenerationLocation = location;
//         })
//     }
// })