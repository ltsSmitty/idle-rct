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

export type GuestGenerationStatsState = Record<keyof GuestGenerationKey, ModifierValue>

export const initialGuestGenerationStateValues: GuestGenerationStatsState = {
    "hunger": { value: 1, delta: 1 },
    "thirst": { value: 1, delta: 1 },
    "happiness": { value: 7, delta: 3 },
    "nausea": { value: 0, delta: 1 },
    "toilet": { value: 1, delta: 2 },
    "energy": { value: 8, delta: 2 },
    "intensityPreferenceRange": { value: 5, delta: 2 },
    "nauseaToleranceRange": { value: 5, delta: 2 }
}

interface GuestGenerationStatsActions {
    increaseGuestGenerationStat: ({ key, modifierValue, amount }: { key: keyof GuestGenerationKey, modifierValue: keyof ModifierValue, amount: number }) => void;
}

export interface GuestGenerationStatsSlice extends GuestGenerationStatsState, GuestGenerationStatsActions { }