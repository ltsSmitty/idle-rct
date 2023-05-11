import { ModifierValue } from "./guestGenerationStatsSlice";


export type ActivityDurationState = Record<GuestActivityKey, ModifierValue>;

/**
 * Represents the initial state of the activity durations modifiers.
 * @type {ActivityDurationState}
 */
export const initialActivityDurationState: ActivityDurationState = {
    WAITING_IN_LINE: {
        value: 50,
        delta: 50
    },
    RIDING_RIDE: {
        value: 40,
        delta: 10
    },
    EATING: {
        value: 30,
        delta: 3
    },
    DRINKING: {
        value: 30,
        delta: 0
    },
    USING_TOILET: {
        value: 40,
        delta: 0
    },
    WATCHING_RIDE: {
        value: 30,
        delta: 10
    },
    WATCHING_CONSTRUCTION: {
        value: 30,
        delta: 10
    },
    SITTING: {
        value: 50,
        delta: 30
    },
    WALKING_TO_RIDE: {
        value: 50,
        delta: 40
    },
    WALKING_TO_SHOP: {
        value: 40,
        delta: 30
    },
    WALKING_TO_TOILET: {
        value: 50,
        delta: 40
    },
    WALKING_TO_RIDE_ENTRANCE: {
        value: 10,
        delta: 15
    },
    WALKING_TO_RIDE_EXIT: {
        value: 10,
        delta: 0
    },
    WALKING_TO_PARK_ENTRANCE: {
        value: 20,
        delta: 0
    },
    WALKING_TO_PARK_EXIT: {
        value: 50,
        delta: 25
    },
    VOMITING: {
        value: 30,
        delta: 0
    },
    WANDERING: {
        value: 40,
        delta: 20
    },
    GONE: {
        value: 0,
        delta: 0
    }
};
