const backyardScenario: Scenario = {
    name: "Backyard",
    description: "A small backyard with one ride and a few guests.",
    imagePath: "/backyard-coaster-1.jpeg",
    initialState: {
        numVisitors: 10,
        parkRating: 0.5,
        parkValue: 10000,
        money: 10000
    },
    completionState: {
        numVisitors: 100,
        parkRating: 5,
        parkValue: 100000,
        money: 100000
    }
}

export const scenarios = [backyardScenario];