interface Scenario {
    name: string;
    description: string;
    imagePath: string;
    initialState: ScenarioState
    completionState: ScenarioState
}
interface ScenarioState {
    numVisitors?: number;
    parkRating?: number;
    parkValue?: number;
    money?: number;
}

interface Account {
    name: string;
    id: string;
    accountIndex: number;
}

enum GuestActivity {
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

type CoordsXYZ = {
    x: number;
    y: number;
    z: number;
}

type BoundedProperty = {
    lowerBound: number;
    upperBound: number;
}

interface Guest {
    id: number;
    name: string;
    location: CoordsXYZ;

    hunger: number;
    thirst: number;
    happiness: number;
    nausea: number;
    toilet: number;
    energy: number;

    intensityPreferenceRange: BoundedProperty
    nauseaToleranceRange: BoundedProperty

    currentActivity: GuestActivity;
    nextActivity: GuestActivity | null;
    ticksTilActivityChange: number;
}

type GuestActivityEffectModifiers = {
    [key in GuestActivity]: {
        hunger: number,
        thirst: number,
        happiness: number,
        nausea: number,
        toilet: number,
        energy: number,
    }
}