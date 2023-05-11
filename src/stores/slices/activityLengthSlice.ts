import { ModifierValue } from "./guestGenerationStatsSlice";

export type ActivityLengthState = ModifierValue

export const initialActivityLengthState: ActivityLengthState = {
    /** Central value for how many ticks to complete any activity */
    value: 50,
    /** How much the value can differnt from the central value */
    delta: 25
}