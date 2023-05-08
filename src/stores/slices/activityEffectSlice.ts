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

export type ActivityKeys = Pick<Guest, "happiness" | "energy" | "hunger" | "thirst" | "nausea" | "toilet">

export type GuestActivityEffectState = Record<GuestActivity, ActivityKeys>

export const initialGuestActivityEffectState: Record<GuestActivity, ActivityKeys> = {
    [GuestActivity.WAITING_IN_LINE]: {
        happiness: -0.1,
        energy: 0.1,
        hunger: 0.1,
        thirst: 0.1,
        nausea: -0.1,
        toilet: 0.1,
    },
    [GuestActivity.RIDING_RIDE]: {
        happiness: 0.3,
        energy: 0.1,
        hunger: 0,
        thirst: 0,
        toilet: 0.1,
        nausea: 0.2
    },
    [GuestActivity.EATING]: {
        energy: 0.1,
        hunger: -1.0,
        thirst: 0.2,
        toilet: 0.1,
        happiness: 0.1,
        nausea: -0.1
    },
    [GuestActivity.DRINKING]: {
        happiness: 0.1,
        energy: 0.1,
        hunger: 0.1,
        thirst: -1.0,
        toilet: 0.1,
        nausea: -0.1
    },
    [GuestActivity.USING_TOILET]: {
        happiness: -0.5,
        energy: 0,
        hunger: 0,
        thirst: 0,
        toilet: -1.0,
        nausea: -0.2
    },
    [GuestActivity.WATCHING_RIDE]: {
        happiness: -0.1,
        energy: 0.1,
        hunger: 0.1,
        thirst: 0.1,
        toilet: 0.1,
        nausea: -0.1
    },
    [GuestActivity.WATCHING_CONSTRUCTION]: {
        happiness: 0.1,
        energy: 0.1,
        hunger: 0.1,
        thirst: 0.1,
        toilet: 0.1,
        nausea: -0.1
    },
    [GuestActivity.SITTING]: {
        happiness: 0.1,
        energy: 0.1,
        hunger: 0.1,
        thirst: 0.1,
        toilet: 0.1,
        nausea: -0.1
    },
    [GuestActivity.WALKING_TO_RIDE]: {
        happiness: +0.1,
        energy: -0.1,
        hunger: +0.1,
        thirst: +0.1,
        toilet: +0.1,
        nausea: -0.1
    },
    [GuestActivity.WALKING_TO_SHOP]: {
        happiness: -0.1,
        energy: -0.1,
        hunger: +0.1,
        thirst: +0.1,
        toilet: +0.1,
        nausea: -0.1
    },
    [GuestActivity.WALKING_TO_TOILET]: {
        happiness: -0.1,
        energy: -0.1,
        hunger: +0.1,
        thirst: +0.1,
        toilet: +0.1,
        nausea: -0.1
    },

    [GuestActivity.WALKING_TO_RIDE_ENTRANCE]: {
        happiness: -0.1,
        energy: -0.1,
        hunger: +0.1,
        thirst: +0.1,
        toilet: +0.1,
        nausea: -0.1
    },
    [GuestActivity.WALKING_TO_RIDE_EXIT]: {
        happiness: -0.1,
        energy: -0.1,
        hunger: +0.1,
        thirst: +0.1,
        toilet: +0.1,
        nausea: -0.1
    },
    [GuestActivity.WALKING_TO_PARK_ENTRANCE]: {
        happiness: -0.1,
        energy: -0.1,
        hunger: +0.1,
        thirst: +0.1,
        toilet: +0.1,
        nausea: -0.1
    },
    [GuestActivity.WALKING_TO_PARK_EXIT]: {
        happiness: -0.1,
        energy: -0.1,
        hunger: +0.1,
        thirst: +0.1,
        toilet: +0.1,
        nausea: -0.1
    },
    [GuestActivity.VOMITING]: {
        happiness: -0.1,
        energy: -0.1,
        hunger: +0,
        thirst: +0,
        toilet: +0,
        nausea: -1
    },
    [GuestActivity.WANDERING]: {
        happiness: -0.1,
        energy: -0.1,
        hunger: +0.1,
        thirst: +0.1,
        toilet: +0.1,
        nausea: +0.1
    },
    [GuestActivity.GONE]: {
        happiness: 0,
        energy: 0,
        hunger: 0,
        thirst: 0,
        toilet: 0,
        nausea: 0
    }
};