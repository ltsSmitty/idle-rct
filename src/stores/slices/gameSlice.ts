import { SliceState } from "../middlewares";
import { GuestSlice } from "./guestSlice";

export interface GameState {
    readonly tick: number,
}

export const initialGameState: GameState = {
    tick: 0,
};

interface GameActions {
    incrementTick: () => void,
}

export interface GameSlice extends GameState, GameActions { }

export const createGameSlice: SliceState<GameSlice, GuestSlice> = (set) => ({
    tick: 0,
    incrementTick: () => {
        set(
            ((state) => {

                state.tick += 1
                console.log(`new tick: #${state.tick}`)
                // const { guests } = gc.doTick({ guests: state.guests, tick: state.tick })
                // state.guests = guests;
            }))
    }

})

