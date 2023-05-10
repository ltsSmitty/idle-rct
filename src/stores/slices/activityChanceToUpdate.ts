import { ModifierValue } from "./guestGenerationStatsSlice";

export interface ActivityChanceToUpdateState extends ModifierValue {
    /** Central value for how likely that the tick will happen */
    value: number;

    /** How much the value can differ from the central value */
    delta: number;
}

export const initialActivityChanceToUpdateState: ActivityChanceToUpdateState = {
    value: 0.1,
    delta: 0.1
}