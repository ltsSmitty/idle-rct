import { type GuestGenerationStatsState } from "~/stores/slices/guestGenerationStatsSlice";
import { type GuestActivityKey } from "~/stores/slices/activityEffectSlice";

/** The range + and - from the Guest's chosen intensityPreferenceRange and nauseaTolleranceRange */
const BOUNDED_PROPERTY_RANGE = 1.5;

const STARTING_GUEST_ACTIVITY: GuestActivityKey = "WALKING_TO_PARK_ENTRANCE"

export const generateGuestsFromStats = (props: {
    guestStats: GuestGenerationStatsState,
    guestGenerationLocation: CoordsXYZ,
    /** The next id number to be assigned. Automatically increments from there based on number of guests generated. */
    firstNextGuestId: number,
    startingActivity?: GuestActivityKey
    numberOfGuestsToGenerate: number
}): { newGuests: Guest[], nextGuestId: number } => {
    const { guestStats, guestGenerationLocation, firstNextGuestId, startingActivity, numberOfGuestsToGenerate } = props;

    const newGuests: Guest[] = []

    for (let i = 0; i < numberOfGuestsToGenerate; i++) {
        const guestId = firstNextGuestId + i;
        const guest = generateGuest({
            guestStats,
            guestGenerationLocation,
            guestId,
            startingActivity
        });
        newGuests.push(guest);
    }
    return {
        newGuests,
        nextGuestId: firstNextGuestId + numberOfGuestsToGenerate
    }
}

const generateGuest = (props: {
    guestStats: GuestGenerationStatsState,
    guestGenerationLocation: CoordsXYZ,
    guestId: number,
    startingActivity?: GuestActivityKey
}): Guest => {
    const { guestStats, guestGenerationLocation, startingActivity, guestId } = props;

    const intensityMidpoint = calculateModifierValue(guestStats.intensityPreferenceRange, 10, 0)
    const nauseaMidpoint = calculateModifierValue(guestStats.nauseaToleranceRange, 10, 0)

    const newGuest: Guest = {
        id: guestId,
        name: `Guest ${guestId}`,
        location: guestGenerationLocation,

        hunger: calculateModifierValue(guestStats.hunger, 100, 0),
        thirst: calculateModifierValue(guestStats.thirst, 100, 0),
        happiness: calculateModifierValue(guestStats.happiness, 100, 0),
        nausea: calculateModifierValue(guestStats.nausea, 100, 0),
        toilet: calculateModifierValue(guestStats.toilet, 100, 0),
        energy: calculateModifierValue(guestStats.energy, 100, 0),

        intensityPreferenceRange: {
            lowerBound: intensityMidpoint - BOUNDED_PROPERTY_RANGE,
            upperBound: intensityMidpoint + BOUNDED_PROPERTY_RANGE
        },
        nauseaToleranceRange: {
            lowerBound: nauseaMidpoint - BOUNDED_PROPERTY_RANGE,
            upperBound: nauseaMidpoint + BOUNDED_PROPERTY_RANGE
        },
        currentActivity: startingActivity ?? STARTING_GUEST_ACTIVITY,
        destinationRideId: undefined,

        nextActivity: startingActivity ?? null,
        ticksTilActivityChange: -1
    }
    return newGuest;
}

/** How an upgrade impacts a guest stat, e.g. hunger */
type ModifierValue = {
    /** The central value for a stat */
    value: number;

    /** The value range that a stat can be from the central value*/
    delta: number;
}


/**
 * Calculates a random value for a given modifier within a specified range.
 * @param modifier The modifier value to calculate.
 * @param max The maximum value that the modifier can be.
 * @param min The minimum value that the modifier can be.
 * @returns A random value for the modifier within the specified range.
 */
export const calculateModifierValue = (modifier: ModifierValue, max: number, min: number) => {
    return Math.min(max, // clamp <= 10
        Math.max(min, // clamp >= 0
            modifier.value + (Math.random() * modifier.delta * 2) - modifier.delta))
}

export default generateGuestsFromStats;