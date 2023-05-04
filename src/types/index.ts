import type { GuestActivity } from "./GuestActivity";


export interface Scenario {
    name: string;
    description: string;
    imagePath: string;
    initialState: ScenarioState
    completionState: ScenarioState
}
export interface ScenarioState {
    numVisitors?: number;
    parkRating?: number;
    parkValue?: number;
    money?: number;
}

export interface Account {
    name: string;
    id: string;
    accountIndex: number;
}

export type CoordsXYZ = {
    x: number;
    y: number;
    z: number;
}

export type BoundedProperty = {
    lowerBound: number;
    upperBound: number;
}

export interface Guest {
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

export type GuestActivityEffectModifiers = {
    [key in GuestActivity]: {
        hunger: number,
        thirst: number,
        happiness: number,
        nausea: number,
        toilet: number,
        energy: number,
    }
}