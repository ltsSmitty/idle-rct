
import { GuestActivity } from "~/types/GuestActivity";

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


const baseGuestActivityEffect: Record<GuestActivity, (guest: Guest) => void> = {
    [GuestActivity.WAITING_IN_LINE]: (guest) => {
        guest.energy -= 0.1
        guest.hunger += 0.1
        guest.thirst += 0.1
        guest.toilet += 0.1
        guest.happiness -= 0.1
        guest.nausea -= 0.1
    },
    [GuestActivity.RIDING_RIDE]: (guest) => {
        guest.energy += 0.1
        guest.toilet += 0.1
        guest.happiness += 0.3
        guest.nausea += 0.2
    },
    [GuestActivity.EATING]: (guest) => {
        guest.energy += 0.1
        guest.hunger -= 1.0
        guest.thirst += 0.2
        guest.toilet += 0.1
        guest.happiness += 0.1
        guest.nausea -= 0.1
    },
    [GuestActivity.DRINKING]: (guest) => {
        guest.thirst -= 1.0
        guest.toilet += 0.1
        guest.happiness += 0.1
        guest.nausea -= 0.1
    },
    [GuestActivity.USING_TOILET]: (guest) => {
        guest.toilet -= 1.0
        guest.happiness -= 0.5
        guest.nausea -= 0.2
    },
    [GuestActivity.WATCHING_RIDE]: (guest) => {
        guest.energy -= 0.1
        guest.hunger += 0.1
        guest.thirst += 0.1
        guest.toilet += 0.1
        guest.happiness -= 0.1
        guest.nausea -= 0.1
    },
    [GuestActivity.WATCHING_CONSTRUCTION]: (guest) => {
        guest.energy -= 0.1
        guest.hunger += 0.1
        guest.thirst += 0.1
        guest.toilet += 0.1
        guest.happiness -= 0.1
        guest.nausea -= 0.1
    },
    [GuestActivity.SITTING]: (guest) => {
        guest.energy -= 0.1
        guest.hunger += 0.1
        guest.thirst += 0.1
        guest.toilet += 0.1
        guest.happiness -= 0.1
        guest.nausea -= 0.1
    },
    [GuestActivity.WALKING_TO_RIDE]: (guest) => {
        guest.energy -= 0.1
        guest.hunger += 0.1
        guest.thirst += 0.1
        guest.toilet += 0.1
        guest.happiness -= 0.1
        guest.nausea -= 0.1
    },
    [GuestActivity.WALKING_TO_SHOP]: (guest) => {
        guest.energy -= 0.1
        guest.hunger += 0.1
        guest.thirst += 0.1
        guest.toilet += 0.1
        guest.happiness -= 0.1
        guest.nausea -= 0.1
    },
    [GuestActivity.WALKING_TO_TOILET]: (guest) => {
        guest.energy -= 0.1
        guest.hunger += 0.1
        guest.thirst += 0.1
        guest.toilet += 0.1
        guest.happiness -= 0.1
        guest.nausea -= 0.1
    },

    [GuestActivity.WALKING_TO_RIDE_ENTRANCE]: (guest) => {
        guest.energy -= 0.1
        guest.hunger += 0.1
        guest.thirst += 0.1
        guest.toilet += 0.1
        guest.happiness -= 0.1
        guest.nausea -= 0.1
    },
    [GuestActivity.WALKING_TO_RIDE_EXIT]: (guest) => {
        guest.energy -= 0.1
        guest.hunger += 0.1
        guest.thirst += 0.1
        guest.toilet += 0.1
        guest.happiness -= 0.1
        guest.nausea -= 0.1
    },
    [GuestActivity.WALKING_TO_PARK_ENTRANCE]: (guest) => {
        guest.energy -= 0.1
        guest.hunger += 0.1
        guest.thirst += 0.1
        guest.toilet += 0.1
        guest.happiness -= 0.1
        guest.nausea -= 0.1
    },
    [GuestActivity.WALKING_TO_PARK_EXIT]: (guest) => {
        guest.energy -= 0.1
        guest.hunger += 0.1
        guest.thirst += 0.1
        guest.toilet += 0.1
        guest.happiness -= 0.1
        guest.nausea -= 0.1
    },
    [GuestActivity.VOMITING]: (guest) => {
        guest.energy -= 0.1
        guest.hunger += 0.1
        guest.thirst += 0.1
        guest.toilet += 0.1
        guest.happiness -= 0.1
        guest.nausea += 0.1
    },
    [GuestActivity.WANDERING]: (guest) => {
        guest.energy -= 0.1
        guest.hunger += 0.1
        guest.thirst += 0.1
        guest.toilet += 0.1
        guest.happiness -= 0.1
        guest.nausea -= 0.1
    },
    [GuestActivity.GONE]: (guest) => {
        guest.energy = 0
        guest.hunger = 0
        guest.thirst = 0
        guest.toilet = 0
        guest.happiness = 0
        guest.nausea = 0
    }
}

export const calculateModifierValue = (modifier: ModifierValue) => {
    return Math.min(10, // clamp <= 10
        Math.max(0, // clamp >= 0
            modifier.value + (Math.random() * modifier.delta * 2) - modifier.delta))
}