
import { clamp } from "~/pages/play";

export type GuestGenerationKey = Pick<Guest,
    "hunger" |
    "thirst" |
    "happiness" |
    "nausea" |
    "toilet" |
    "energy" |
    "intensityPreferenceRange" | // since this is a range, this will be the central value
    "nauseaToleranceRange"// since this is a range, this will be the central value
>

/** How an upgrade impacts a guest stat, e.g. hunger */
export type ModifierValue = {
    /** The central value for a stat */
    value: number;

    /** The value range that a stat can be from the central value*/
    delta: number;
}

type GuestGenerationModifiers = Record<keyof GuestGenerationKey, ModifierValue>

const defaultModifiers: GuestGenerationModifiers = {
    "hunger": { value: 1, delta: 1 },
    "thirst": { value: 1, delta: 1 },
    "happiness": { value: 7, delta: 3 },
    "nausea": { value: 0, delta: 1 },
    "toilet": { value: 3, delta: 2 },
    "energy": { value: 6, delta: 2 },
    "intensityPreferenceRange": { value: 5, delta: 2 },
    "nauseaToleranceRange": { value: 5, delta: 2 }
}

export const calculateModifierValue = (modifier: ModifierValue) => {
    return clamp(modifier.value + (Math.random() * modifier.delta * 2) - modifier.delta, 0, 10)
}