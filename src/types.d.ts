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

type GuestActivity =
    "waiting in line" |
    "riding ride" |
    "eating" |
    "drinking" |
    "using toilet" |
    "watching ride" |
    "watching construction" |
    "sitting" |
    "walking to a ride" |
    "walking to a shop" |
    "walking to toilet" |
    "walking to ride entrance" |
    "walking to ride exit" |
    "walking to park entrance" |
    "walking to park exit" |
    "vomiting" |
    "wandering" |
    "gone" // this guest will no longer count for anything, either dead or left the park

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