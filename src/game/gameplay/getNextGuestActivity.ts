import { GuestActivity } from "~/stores/slices/activityEffectSlice";

type GuestGameStat = Pick<Guest, "energy" | "happiness" | "nausea" | "thirst" | "toilet" | "hunger">

type ActivityWeights = Partial<Record<GuestActivity, number>>

/** Activities that will be chosen from if the guest is not in the middle of another activity, or adversely impacted by negative stats. */
const baseActivityWeights: ActivityWeights = {
    [GuestActivity.WALKING_TO_RIDE]: 5,
    [GuestActivity.WANDERING]: .5,
    [GuestActivity.WATCHING_RIDE]: 2,
    [GuestActivity.WATCHING_CONSTRUCTION]: 1,
    [GuestActivity.WALKING_TO_PARK_EXIT]: .2,
    [GuestActivity.SITTING]: 1,
}

/** If a negative stat gets at least this high, it'll start adversely weighing into their decision making */
const NEGATIVE_IMPACT_THRESHOLD_LOW = 7;
const NEGATIVE_IMPACT_THRESHOLD_MED = 8;
const NEGATIVE_IMPACT_THRESHOLD_HIGH = 9;

/** If a positive stat gets at least this low, it'll start adversely weighing into their decision making */
const POSITIVE_IMPACT_THRESHOLD_LOW = 3;
const POSITIVE_IMPACT_THRESHOLD_MED = 2;
const POSITIVE_IMPACT_THRESHOLD_HIGH = 1;

/** Strongly influence that the next event will be this */
const IMPACT_WEIGHT_HIGH = 50
/** Medium influence that the next event will be this */
const IMPACT_WEIGHT_MED = 5
/** Weakly influence that the next event will be this */
const IMPACT_WEIGHT_LOW = 2

type NegativeImpact = "high" | "medium" | "low";

type AdverseEffects = { [k in keyof GuestGameStat]?: { isEffected: boolean, impact: NegativeImpact } };

/** Compute whether the guest's stat value will have a negative impact on choosing their next activity */
const getImpact = (stat: keyof GuestGameStat, value: number): NegativeImpact => {
    if (stat === "energy" || stat === "happiness") {
        return value < NEGATIVE_IMPACT_THRESHOLD_HIGH ? "high" : value < NEGATIVE_IMPACT_THRESHOLD_MED ? "medium" : "low";
    } else {
        return value > POSITIVE_IMPACT_THRESHOLD_HIGH ? "high" : value > POSITIVE_IMPACT_THRESHOLD_MED ? "medium" : "low";
    }
}

/** Get an object of which guest stats are negative enough to impact their next activity choice. */
const getAdverseImpactedActivities = (guest: Guest): AdverseEffects => {
    const { hunger, thirst, happiness, nausea, toilet, energy } = guest;
    const adverselyImpactedActivities: AdverseEffects = {};
    if (energy < NEGATIVE_IMPACT_THRESHOLD_LOW) {
        adverselyImpactedActivities.energy = { isEffected: true, impact: getImpact("energy", energy) };
    }
    if (happiness < NEGATIVE_IMPACT_THRESHOLD_LOW) {
        adverselyImpactedActivities.happiness = { isEffected: true, impact: getImpact("happiness", happiness) };
    }
    if (hunger > POSITIVE_IMPACT_THRESHOLD_LOW) {
        adverselyImpactedActivities.hunger = { isEffected: true, impact: getImpact("hunger", hunger) };
    }
    if (thirst > POSITIVE_IMPACT_THRESHOLD_LOW) {
        adverselyImpactedActivities.thirst = { isEffected: true, impact: getImpact("thirst", thirst) };
    }
    if (nausea > POSITIVE_IMPACT_THRESHOLD_LOW) {
        adverselyImpactedActivities.nausea = { isEffected: true, impact: getImpact("nausea", nausea) };
    }
    if (toilet > POSITIVE_IMPACT_THRESHOLD_LOW) {
        adverselyImpactedActivities.toilet = { isEffected: true, impact: getImpact("toilet", toilet) };
    }
    return adverselyImpactedActivities;
}

/**
 * Check if the guest has any adverse impacts on their stats that would affect their next activity choice, such as low energy/happiness or high nausea/hunger/thirst/toilet.
 * @param guest - The guest to check for adverse impacts.
 * @returns A boolean indicating whether the guest has any adverse impacts on their stats.
 */
export const guestHasAdverseImpacts = (guest: Guest): boolean => {
    const adverseImpacts = getAdverseImpactedActivities(guest);
    return Object.keys(adverseImpacts).length > 0;
}

/** Compute the next activity for the guest based on their current stats.
 * Having stats in a negative zone (e.g happiness too low, toilet too high) will result in weighing more heavily toward the corresponding events, (e.g. buying food, vomiting, leaving the park). @returns the next chosen activity.
*/
export const getNextGuestActivity = (guest: Guest): { activity: GuestActivity } => {
    const { currentActivity } = guest;

    const { weights, interruptable } = nextActivityWeight[currentActivity];

    // if their current activity isnt' interruptable, just call weighted random instead of considering adverse impacts
    if (!interruptable) {
        console.log(`${currentActivity} not interruptable`)
        const nextActivity = weightedRandom(weights);
        console.log(`${nextActivity} chosen next`)
        return { activity: nextActivity };
    }

    // scan through stats to discover which are problematic
    const adverseImpactActivities = getAdverseImpactedActivities(guest);

    // Do regular activity change
    if (Object.keys(adverseImpactActivities).length === 0) {
        const nextActivity = weightedRandom(weights);
        return { activity: nextActivity };
    }


    console.log(`There are negative stats influencing this guest: ${JSON.stringify(Object.keys(adverseImpactActivities))}`)
    // Do adverse activity change
    // Add the adverse events weight to weights
    const negativeWeights = Object.entries(adverseImpactActivities).map(([stat, effect]) => getNegativeImpactWeight(stat as keyof GuestGameStat, effect.impact));

    console.log(`The negative weights are: ${JSON.stringify(negativeWeights, null, 2)}`)

    const combinedWeights = negativeWeights.reduce((acc, curr) => {
        Object.entries(curr).forEach(([activity, weight]) => {
            (acc[activity as GuestActivity])
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ? acc[activity as GuestActivity]! += weight
                : acc[activity as GuestActivity] = weight;
        });
        return acc;
    }, { ...weights });

    console.log(`The combined weights are: ${JSON.stringify(combinedWeights, null, 2)}`)

    const nextActivity = weightedRandom(combinedWeights);
    return { activity: nextActivity };
}


/**
 * Returns an object containing weights for each activity based on the given negative impact and stat.
 * @param stat - The stat that has a negative impact.
 * @param impact - The level of negative impact on the stat.
 * @returns An object containing weights for each activity based on the given negative impact and stat.
 */
const getNegativeImpactWeight = (stat: keyof GuestGameStat, impact: NegativeImpact): ActivityWeights => {
    const weight = impact === "high" ? IMPACT_WEIGHT_HIGH : impact === "medium" ? IMPACT_WEIGHT_MED : IMPACT_WEIGHT_LOW;
    switch (stat) {
        case "energy":
            return {
                [GuestActivity.SITTING]: weight,
                [GuestActivity.WALKING_TO_PARK_EXIT]: weight / 2,
            }
        case "happiness":
            return {
                [GuestActivity.WALKING_TO_RIDE]: weight,
                [GuestActivity.WANDERING]: weight,
                [GuestActivity.WATCHING_RIDE]: weight,
                [GuestActivity.WALKING_TO_PARK_EXIT]: weight / 2,
            }
        case "hunger":
            return {
                [GuestActivity.WALKING_TO_SHOP]: weight,
                [GuestActivity.WALKING_TO_PARK_EXIT]: weight / 4,

            }
        case "thirst":
            return {
                [GuestActivity.WALKING_TO_SHOP]: weight,
                [GuestActivity.WALKING_TO_PARK_EXIT]: weight / 4,

            }
        case "nausea":
            return {
                [GuestActivity.WALKING_TO_TOILET]: weight,
                [GuestActivity.VOMITING]: weight,
                [GuestActivity.SITTING]: weight,
                [GuestActivity.WALKING_TO_PARK_EXIT]: weight / 4,

            }
        case "toilet":
            return {
                [GuestActivity.WALKING_TO_TOILET]: weight,
                [GuestActivity.WALKING_TO_PARK_EXIT]: weight / 6,
            }
    }
}

/**
 * Returns a random activity based on the given weights.
 * @param weights - An object containing weights for each activity.
 * @returns A random activity based on the given weights.
 */
const weightedRandom = (weights: ActivityWeights): GuestActivity => {
    if (Object.keys(weights).length === 0) {
        console.error(`Weighted random called with no weights`);
        return GuestActivity.WANDERING;
    }

    // skip all the math if there's only one weight
    if (Object.keys(weights).length === 1) {
        console.log(`only one activity to choose from: ${Object.keys(weights)[0] ?? ""}`)
        return Object.keys(weights)[0] as GuestActivity;
    }

    console.log(`potential next action options:  ${JSON.stringify(Object.keys(weights))}`)
    const totalWeight = Object.values(weights).reduce((acc, weight) => acc + weight, 0);
    const random = Math.random() * totalWeight;
    let weightSum = 0;
    for (const [activity, weight] of Object.entries(weights)) {
        weightSum += weight;
        if (random < weightSum) {
            return activity as GuestActivity;
        }
    }
    console.error(`Weighted random failed for ${JSON.stringify(weights)}`);
    return GuestActivity.WANDERING;
}

/** For any given activity, what are the next potential activities that could be chosen */
const nextActivityWeight: Record<GuestActivity, { weights: ActivityWeights, interruptable: boolean }> = {
    // ride cycle: walk to ride, wait in line, walk to ride entrance, ride ride, walk to ride exit, walk to park exit
    [GuestActivity.WALKING_TO_RIDE]: {
        weights: { [GuestActivity.WAITING_IN_LINE]: 1 },
        interruptable: true
    },
    [GuestActivity.WAITING_IN_LINE]: {
        weights: { [GuestActivity.WALKING_TO_RIDE_ENTRANCE]: 1 },
        interruptable: false
    },
    [GuestActivity.WALKING_TO_RIDE_ENTRANCE]: {
        weights: { [GuestActivity.RIDING_RIDE]: 1 },
        interruptable: false
    },
    [GuestActivity.RIDING_RIDE]: {
        weights: { [GuestActivity.WALKING_TO_RIDE_EXIT]: 1 },
        interruptable: false
    },
    [GuestActivity.WALKING_TO_RIDE_EXIT]: {
        weights: { ...baseActivityWeights },
        interruptable: false
    },

    // park exit cycle: walk to park exit, gone
    [GuestActivity.WALKING_TO_PARK_EXIT]: {
        weights: { [GuestActivity.GONE]: 1 },
        interruptable: true
    },
    [GuestActivity.GONE]: {
        weights: { [GuestActivity.GONE]: 1 }, // they always stay gone
        interruptable: false
    },

    [GuestActivity.WALKING_TO_TOILET]: {
        weights: { [GuestActivity.USING_TOILET]: 1 },
        interruptable: false
    },

    [GuestActivity.WALKING_TO_SHOP]: {
        weights: { [GuestActivity.EATING]: 1, [GuestActivity.DRINKING]: 1 },
        interruptable: false
    },

    // any of these activities can lead to any other general activity
    [GuestActivity.WALKING_TO_PARK_ENTRANCE]: {
        weights: { ...baseActivityWeights },
        interruptable: false
    },
    [GuestActivity.WANDERING]: {
        weights: { ...baseActivityWeights },
        interruptable: true
    },
    [GuestActivity.WATCHING_RIDE]: {
        weights: { ...baseActivityWeights },
        interruptable: true
    },
    [GuestActivity.WATCHING_CONSTRUCTION]: {
        weights: { ...baseActivityWeights },
        interruptable: true
    },
    [GuestActivity.EATING]: {
        weights: { ...baseActivityWeights },
        interruptable: false
    },
    [GuestActivity.DRINKING]: {
        weights: { ...baseActivityWeights },
        interruptable: false
    },
    [GuestActivity.USING_TOILET]: {
        weights: { ...baseActivityWeights },
        interruptable: false
    },
    [GuestActivity.SITTING]: {
        weights: { ...baseActivityWeights },
        interruptable: true
    },
    [GuestActivity.VOMITING]: {
        weights: { ...baseActivityWeights },
        interruptable: false
    },
}

export const canActivityBeInterrupted = (activity: GuestActivity): boolean => {
    return nextActivityWeight[activity].interruptable;
}