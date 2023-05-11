import { ModifierValue } from "./guestGenerationStatsSlice";

/**
 * Represents the state of the activity length modifier.
 * @property {number} value - Central value for how many ticks to complete any activity.
 * @property {number} delta - How much the value can differ from the central value.
 */
export interface ActivityDurationState extends ModifierValue {
    value: number;
    delta: number;
}

/**
 * Represents the initial state of the activity length modifier.
 * @type {ActivityDurationState}
 */
export const initialActivityDurationState: ActivityDurationState = {
    value: 50,
    delta: 25
};
