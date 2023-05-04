
import { GuestActivity } from "~/types/GuestActivity";
import { type Upgrade, UpgradeController, type UpgradeEffect } from "./upgrade";

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


/** The range + and - from the Guest's chosen intensityPreferenceRange and nauseaTolleranceRange */
const BOUNDED_PROPERTY_RANGE = 1.5;

const STARTING_GUEST_ACTIVITY = GuestActivity.WALKING_TO_PARK_ENTRANCE

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


export class GuestBuilder {
    private modifiers: GuestGenerationModifiers = defaultModifiers
    private nextGuestId = 0;
    private guestGenerationLocation: CoordsXYZ = { x: 0, y: 0, z: 0 };

    constructor(modifiers?: GuestGenerationModifiers) {
        if (modifiers) {
            this.modifiers = modifiers
        }
    }

    setModifier(key: keyof GuestGenerationModifiers, value: ModifierValue) {
        this.modifiers[key] = value
        return this;
    }

    setAllModifiers(modifiers: GuestGenerationModifiers) {
        this.modifiers = modifiers
        return this;
    }

    setNextGuestId(id: number) {
        this.nextGuestId = id
        return this;
    }

    setSpawnLocation(location: CoordsXYZ) {
        this.guestGenerationLocation = location
        return this;
    }

    getModifiers() {
        return this.modifiers
    }

    private generateGuest(): Guest {

        const intensityMidpoint = calculateModifierValue(this.modifiers.intensityPreferenceRange)
        const nauseaMidpoint = calculateModifierValue(this.modifiers.nauseaToleranceRange)

        const thisGuestId = this.nextGuestId++

        const newGuest = {
            id: thisGuestId,
            name: `Guest ${thisGuestId}`,
            location: this.guestGenerationLocation,


            hunger: calculateModifierValue(this.modifiers.hunger),
            thirst: calculateModifierValue(this.modifiers.thirst),
            happiness: calculateModifierValue(this.modifiers.happiness),
            nausea: calculateModifierValue(this.modifiers.nausea),
            toilet: calculateModifierValue(this.modifiers.toilet),
            energy: calculateModifierValue(this.modifiers.energy),

            intensityPreferenceRange: {
                lowerBound: intensityMidpoint - BOUNDED_PROPERTY_RANGE,
                upperBound: intensityMidpoint + BOUNDED_PROPERTY_RANGE
            },
            nauseaToleranceRange: {
                lowerBound: nauseaMidpoint - BOUNDED_PROPERTY_RANGE,
                upperBound: nauseaMidpoint + BOUNDED_PROPERTY_RANGE
            },
            currentActivity: STARTING_GUEST_ACTIVITY,
            ticksTilActivityChange: -1
        }
        return newGuest;
    }

    generateGuests(numGuests: number): Guest[] {
        const guests: Guest[] = []
        for (let i = 0; i < numGuests; i++) {
            guests.push(this.generateGuest())
        }
        return guests;
    }
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


export class GuestGenerator {
    private guestGenerationRate = 3 // guests per tick

    guestBuilder: GuestBuilder
    private upgrades: Upgrade[] = []
    private numberOfUpgrades = 0;

    constructor() {
        this.guestBuilder = new GuestBuilder()
    }

    upgradeGuestGenerationRate(upgradeEffect?: UpgradeEffect): void {
        if (!upgradeEffect) return;
        this.guestGenerationRate += upgradeEffect.addend
        this.guestGenerationRate *= upgradeEffect.multiplier
    }

    private calculateGuestsToGenerate(): number {
        // this is where we'll factor in any specific multipliers
        return this.guestGenerationRate

    }

    generate(): Guest[] {
        const numGuests = this.calculateGuestsToGenerate();

        return this.guestBuilder.generateGuests(numGuests)
    }

}


export class GuestUpdater {
    guestGenerator: GuestGenerator
    guestBuilder: GuestBuilder

    constructor(guestGenerator: GuestGenerator) {
        this.guestGenerator = guestGenerator
        this.guestBuilder = new GuestBuilder()
    }

    updateExistingGuests(guests: Guest[]) {
        const mappedGuests = guests.map(g => {
            baseGuestActivityEffect[g.currentActivity]({ ...g })
        })
        return mappedGuests
    }

    createNewGuests(numGuests: number, activity: GuestActivity) {
        const newGuests = this.guestBuilder.generateGuests(numGuests)
        newGuests.forEach(g => baseGuestActivityEffect[activity](g))
        return newGuests
    }
}

export const calculateModifierValue = (modifier: ModifierValue) => {
    return Math.min(10, // clamp <= 10
        Math.max(0, // clamp >= 0
            modifier.value + (Math.random() * modifier.delta * 2) - modifier.delta))
}

export class GuestController {
    guests: Guest[] = []

    ticks = 0;

    private guestGenerator: GuestGenerator

    private guestUpdater: GuestUpdater

    private upgradeController: UpgradeController

    constructor(props?: { guestGenerator?: GuestGenerator, guestUpdater?: GuestUpdater, upgradeController?: UpgradeController }) {
        this.guestGenerator = props?.guestGenerator || new GuestGenerator();
        this.guestUpdater = props?.guestUpdater || new GuestUpdater(this.guestGenerator);
        this.upgradeController = props?.upgradeController || new UpgradeController();
    }

    // needs a guest builder for actually creating new Guests
    // needs a guest tick activity updater for updating the current activity of Guests
    // needs an update applier for applying the effects of the upgrades to new and existing Guests

    private applyUpgrades() {
        // apply upgrades for new guests
        this.upgradeController.applyUpgrades({ guestGenerator: this.guestGenerator, guests: this.guests });
    }

    incrementGuestActivity() {
        // loop through all guests and
    }

    doTick({ guests }: { guests: Guest[], tick: number }) {
        // const { guests, tick } = props;
        // this.ticks = tick;
        this.applyUpgrades();

        // calculate + perform existing guests' tick activity
        // this.guestUpdater.updateExistingGuests(guests)

        // generate new guests
        const newGuests = this.guestGenerator.generate()
        console.log(`adding ${newGuests.length} new guests`)
        // gameStores.default.addGuests(newGuests);
        const allGuests = [...this.guests, ...newGuests]
        this.guests = allGuests

        // calculate + perform new guests' tick activity

        return { guests: this.guests }
    }
}