export enum GuestActivity {
    WAITING_IN_LINE = "waiting in line",
    RIDING_RIDE = "riding ride",
    EATING = "eating",
    DRINKING = "drinking",
    USING_TOILET = "using toilet",
    WATCHING_RIDE = "watching ride",
    WATCHING_CONSTRUCTION = "watching construction",
    SITTING = "sitting",
    WALKING_TO_RIDE = "walking to a ride",
    WALKING_TO_SHOP = "walking to a shop",
    WALKING_TO_TOILET = "walking to toilet",
    WALKING_TO_RIDE_ENTRANCE = "walking to ride entrance",
    WALKING_TO_RIDE_EXIT = "walking to ride exit",
    WALKING_TO_PARK_ENTRANCE = "walking to park entrance",
    WALKING_TO_PARK_EXIT = "walking to park exit",
    VOMITING = "vomiting",
    WANDERING = "wandering",
    GONE = "gone" // this guest will no longer count for anything, either dead or left the park
}

export type GuestActivityKey = keyof typeof GuestActivity

export type ActivityKeys = Pick<Guest, "happiness" | "energy" | "hunger" | "thirst" | "nausea" | "toilet">

export type GuestActivityEffectState = Record<GuestActivityKey, ActivityKeys>

export const initialGuestActivityEffectState: GuestActivityEffectState = {
    WAITING_IN_LINE: {
        happiness: 0,
        energy: 1,
        hunger: 5,
        thirst: 5,
        nausea: -1,
        toilet: 5,
    },
    RIDING_RIDE: {
        happiness: 3,
        energy: 1,
        hunger: 0,
        thirst: 0,
        toilet: 1,
        nausea: 2
    },
    EATING: {
        energy: 1,
        hunger: -10,
        thirst: 2,
        toilet: 1,
        happiness: 1,
        nausea: -1
    },
    DRINKING: {
        happiness: 1,
        energy: 1,
        hunger: 1,
        thirst: -1,
        toilet: 1,
        nausea: -1
    },
    USING_TOILET: {
        happiness: -5,
        energy: 0,
        hunger: 0,
        thirst: 0,
        toilet: -1,
        nausea: -2
    },
    WATCHING_RIDE: {
        happiness: -0,
        energy: 1,
        hunger: 1,
        thirst: 1,
        toilet: 1,
        nausea: -1
    },
    WATCHING_CONSTRUCTION: {
        happiness: 1,
        energy: 1,
        hunger: 1,
        thirst: 1,
        toilet: 1,
        nausea: -1
    },
    SITTING: {
        happiness: 1,
        energy: 1,
        hunger: 1,
        thirst: 1,
        toilet: 1,
        nausea: -1
    },
    WALKING_TO_RIDE: {
        happiness: 1,
        energy: -1,
        hunger: 1,
        thirst: 1,
        toilet: 1,
        nausea: -1
    },
    WALKING_TO_SHOP: {
        happiness: -1,
        energy: -1,
        hunger: 1,
        thirst: 1,
        toilet: 1,
        nausea: 1
    },
    WALKING_TO_TOILET: {
        happiness: -1,
        energy: -1,
        hunger: 1,
        thirst: 1,
        toilet: 1,
        nausea: -1
    },

    WALKING_TO_RIDE_ENTRANCE: {
        happiness: -1,
        energy: -1,
        hunger: 1,
        thirst: 1,
        toilet: 1,
        nausea: -1
    },
    WALKING_TO_RIDE_EXIT: {
        happiness: -1,
        energy: -1,
        hunger: 1,
        thirst: 1,
        toilet: 1,
        nausea: -1
    },
    WALKING_TO_PARK_ENTRANCE: {
        happiness: -1,
        energy: -1,
        hunger: 1,
        thirst: 1,
        toilet: 1,
        nausea: -1
    },
    WALKING_TO_PARK_EXIT: {
        happiness: -1,
        energy: -1,
        hunger: 1,
        thirst: 1,
        toilet: 1,
        nausea: -1
    },
    VOMITING: {
        happiness: -1,
        energy: -1,
        hunger: 0,
        thirst: 0,
        toilet: 0,
        nausea: -10
    },
    WANDERING: {
        happiness: -1,
        energy: -1,
        hunger: 1,
        thirst: 1,
        toilet: 1,
        nausea: 1
    },
    GONE: {
        happiness: 0,
        energy: 0,
        hunger: 0,
        thirst: 0,
        toilet: 0,
        nausea: 0
    }
};