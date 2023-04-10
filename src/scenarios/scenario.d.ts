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