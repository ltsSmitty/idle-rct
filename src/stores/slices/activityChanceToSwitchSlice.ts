import { ModifierValue } from "./guestGenerationStatsSlice";

export interface ActivityChanceToSwitchState extends ModifierValue {
    /** Central value for how likely a guest is to switch activities */
    value: number;

    /** How much the value can differ from the central value */
    delta: number;
}

export const initialActivityChanceToSwitchState: ActivityChanceToSwitchState = {
    value: 0.5,
    delta: 0.5
}