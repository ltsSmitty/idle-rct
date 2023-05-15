import { useStore } from "~/stores/slices/allStateInOneWithoutActions";
import { ModifierValue } from "../guest";
import { calculateModifierValue } from "../generateGuests";

type RideTypeDescriptor = Readonly<RideObject>

export enum RideType {
    WOODEN_COASTER,
    VERTICAL_COASTER,
    STEEL_LOOPING_COASTER,
    STEEL_MINI_COASTER,
    SUSPENDED_SWINGING_COASTER,
    WOODEN_WILD_MOUSE_COASTER,
    GIGA_COASTER,
    INVERTED_COASTER,
    LOG_FLUME,
    RIVER_RAPIDS,
    SWINGING_INVERTER_SHIP,
    MINE_TRAIN_COASTER,
    BOBSLEIGH_COASTER,
    SCRAMBLED_EGGS,
    SWINGING_SHIP,
    HAUNTED_HOUSE,
    MERRY_GO_ROUND,
    MONORAIL,
    FERRIS_WHEEL,
    OBSERVATION_TOWER,
    ENTERPRISE,
    BATHROOM,
    BURGER_STALL,
    SODA_STALL,
    ATM,
    INFORMATION_KIOSK,
    FIRST_AID,
    BALLOON_STALL,
    ICE_CREAM_STALL,
}

const woodenCoaster: RideTypeDescriptor = {
    description: "A traditional coaster with wooden supports and a wooden track. It's a classic!",
    capacity: "20 riders per train",
    flags: 0,
    rideType: RideType["WOODEN_COASTER"],
    excitementMultiplier: 1,
    intensityMultiplier: 1,
    nauseaMultiplier: 1,
    maxHeight: 150,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Wooden Roller Coaster",
} as const;

const merryGoRound: RideTypeDescriptor = {
    description: "A classic ride that spins around and around. Fun for all ages!",
    capacity: "30 riders",
    flags: 0,
    rideType: RideType["MERRY_GO_ROUND"],
    excitementMultiplier: 1,
    intensityMultiplier: 1,
    nauseaMultiplier: 1,
    maxHeight: 20,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Merry-Go-Round",
} as const

const steelLoopingCoaster: RideTypeDescriptor = {
    description: "A thrilling coaster with steel supports and a looping track. Hang on tight!",
    capacity: "24 riders per train",
    flags: 0,
    rideType: RideType["STEEL_LOOPING_COASTER"],
    excitementMultiplier: 1.5,
    intensityMultiplier: 2,
    nauseaMultiplier: 1.5,
    maxHeight: 200,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Steel Looping Coaster",
} as const

const steelMiniCoaster: RideTypeDescriptor = {
    description: "A compact steel coaster with tight turns and drops. Perfect for smaller parks!",
    capacity: "12 riders per train",
    flags: 0,
    rideType: RideType["STEEL_MINI_COASTER"],
    excitementMultiplier: 1.2,
    intensityMultiplier: 1.5,
    nauseaMultiplier: 1.2,
    maxHeight: 100,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Steel Mini Coaster",
} as const

const woodenWildMouseCoaster: RideTypeDescriptor = {
    description: "A wooden coaster with tight turns and drops. It's a wild ride!",
    capacity: "6 riders per train",
    flags: 0,
    rideType: RideType["WOODEN_WILD_MOUSE_COASTER"],
    excitementMultiplier: 1.2,
    intensityMultiplier: 1.5,
    nauseaMultiplier: 1.2,
    maxHeight: 100,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Wooden Wild Mouse Coaster",
} as const

const suspendedSwingingCoaster: RideTypeDescriptor = {
    description: "A coaster that swings and sways through the air, suspended from an overhead track. Not for the faint of heart!",
    capacity: "16 riders per train",
    flags: 0,
    rideType: RideType["SUSPENDED_SWINGING_COASTER"],
    excitementMultiplier: 2,
    intensityMultiplier: 2,
    nauseaMultiplier: 1.5,
    maxHeight: 150,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Suspended Swinging Coaster",
} as const

const gigaCoaster: RideTypeDescriptor = {
    description: "A massive coaster with steep drops and high speeds. Not for the faint of heart!",
    capacity: "32 riders per train",
    flags: 0,
    rideType: RideType["GIGA_COASTER"],
    excitementMultiplier: 3,
    intensityMultiplier: 3,
    nauseaMultiplier: 2,
    maxHeight: 300,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Giga Coaster",
} as const

const invertedCoaster: RideTypeDescriptor = {
    description: "A coaster that takes you upside down! Not for the faint of heart.",
    capacity: "24 riders per train",
    flags: 0,
    rideType: RideType["INVERTED_COASTER"],
    excitementMultiplier: 2.5,
    intensityMultiplier: 2.5,
    nauseaMultiplier: 2,
    maxHeight: 200,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Inverted Coaster",
} as const

const verticalCoaster: RideTypeDescriptor = {
    description: "A coaster that takes you straight up and straight down. Not for the faint of heart!",
    capacity: "16 riders per train",
    flags: 0,
    rideType: RideType["VERTICAL_COASTER"],
    excitementMultiplier: 2.5,
    intensityMultiplier: 2.5,
    nauseaMultiplier: 2,
    maxHeight: 250,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Vertical Coaster",
} as const

const logFlume: RideTypeDescriptor = {
    description: "A water ride that takes you through a log flume. Watch out for the big drop at the end!",
    capacity: "20 riders per log",
    flags: 0,
    rideType: RideType["LOG_FLUME"],
    excitementMultiplier: 1.5,
    intensityMultiplier: 1.2,
    nauseaMultiplier: 1.1,
    maxHeight: 50,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Log Flume",
} as const

const riverRapids: RideTypeDescriptor = {
    description: "A water ride that takes you through a river rapids. Get ready to get wet!",
    capacity: "16 riders per boat",
    flags: 0,
    rideType: RideType["RIVER_RAPIDS"],
    excitementMultiplier: 1.8,
    intensityMultiplier: 1.5,
    nauseaMultiplier: 1.2,
    maxHeight: 50,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "River Rapids",
} as const

const swingingInverterShip: RideTypeDescriptor = {
    description: "A ship that swings back and forth, getting higher and higher, and then goes upside down! Hold on tight!",
    capacity: "24 riders",
    flags: 0,
    rideType: RideType["SWINGING_INVERTER_SHIP"],
    excitementMultiplier: 2.8,
    intensityMultiplier: 3.2,
    nauseaMultiplier: 2.5,
    maxHeight: 100,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Swinging Inverter Ship",
} as const

const mineTrainCoaster: RideTypeDescriptor = {
    description: "A coaster that takes you through a mine. Watch out for the sharp turns and sudden drops!",
    capacity: "20 riders per train",
    flags: 0,
    rideType: RideType["MINE_TRAIN_COASTER"],
    excitementMultiplier: 2.2,
    intensityMultiplier: 2.5,
    nauseaMultiplier: 1.8,
    maxHeight: 100,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Mine Train Coaster",
} as const

const bobsleighCoaster: RideTypeDescriptor = {
    description: "A coaster that takes you through a bobsleigh track. Get ready for a wild ride!",
    capacity: "16 riders per train",
    flags: 0,
    rideType: RideType["BOBSLEIGH_COASTER"],
    excitementMultiplier: 2.5,
    intensityMultiplier: 2.8,
    nauseaMultiplier: 2.2,
    maxHeight: 150,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Bobsleigh Coaster",
} as const

const scrambledEggs: RideTypeDescriptor = {
    description: "A spinning ride that makes you feel like you're in a giant frying pan. Don't get scrambled!",
    capacity: "12 riders",
    flags: 0,
    rideType: RideType["SCRAMBLED_EGGS"],
    excitementMultiplier: 1.2,
    intensityMultiplier: 1.5,
    nauseaMultiplier: 1.2,
    maxHeight: 50,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Scrambled Eggs",
} as const

const swingingShip: RideTypeDescriptor = {
    description: "A ship that swings back and forth, getting higher and higher. Hold on tight!",
    capacity: "32 riders",
    flags: 0,
    rideType: RideType["SWINGING_SHIP"],
    excitementMultiplier: 1.8,
    intensityMultiplier: 1.5,
    nauseaMultiplier: 1.2,
    maxHeight: 50,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Swinging Ship",
} as const

const hauntedHouse: RideTypeDescriptor = {
    description: "A spooky haunted house ride. Watch out for ghosts!",
    capacity: "12 riders",
    flags: 0,
    rideType: RideType["HAUNTED_HOUSE"],
    excitementMultiplier: 1.2,
    intensityMultiplier: 1.5,
    nauseaMultiplier: 1.2,
    maxHeight: 50,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Haunted House",
} as const

const monorail: RideTypeDescriptor = {
    description: "A scenic ride that takes you around the park on a monorail. Sit back and enjoy the view!",
    capacity: "20 riders per train",
    flags: 0,
    rideType: RideType["MONORAIL"],
    excitementMultiplier: 1.2,
    intensityMultiplier: 1.2,
    nauseaMultiplier: 1.2,
    maxHeight: 50,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Monorail",
} as const

const ferrisWheel: RideTypeDescriptor = {
    description: "A classic Ferris Wheel ride. Take in the view from the top!",
    capacity: "24 riders",
    flags: 0,
    rideType: RideType["FERRIS_WHEEL"],
    excitementMultiplier: 1.5,
    intensityMultiplier: 1.2,
    nauseaMultiplier: 1.1,
    maxHeight: 50,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Ferris Wheel",
} as const

const observationTower: RideTypeDescriptor = {
    description: "A tall observation tower that takes you high above the park for a stunning view.",
    capacity: "16 riders",
    flags: 0,
    rideType: RideType["OBSERVATION_TOWER"],
    excitementMultiplier: 1.5,
    intensityMultiplier: 1.2,
    nauseaMultiplier: 1.1,
    maxHeight: 100,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Observation Tower",
} as const

const enterprise: RideTypeDescriptor = {
    description: "A thrilling ride that spins you around and around. Hold on tight!",
    capacity: "24 riders",
    flags: 0,
    rideType: RideType["ENTERPRISE"],
    excitementMultiplier: 1.8,
    intensityMultiplier: 1.5,
    nauseaMultiplier: 1.2,
    maxHeight: 50,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Enterprise",
} as const

const bathroom: RideTypeDescriptor = {
    description: "A clean and well-maintained bathroom for your convenience.",
    capacity: "N/A",
    flags: 0,
    rideType: RideType["BATHROOM"],
    excitementMultiplier: 0,
    intensityMultiplier: 0,
    nauseaMultiplier: 0,
    maxHeight: 0,
    shopItem: 0,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Bathroom",
} as const

const burgerStall: RideTypeDescriptor = {
    description: "A delicious burger stall that serves juicy burgers and fries.",
    capacity: "N/A",
    flags: 0,
    rideType: RideType["BURGER_STALL"],
    excitementMultiplier: 1.1,
    intensityMultiplier: 0.8,
    nauseaMultiplier: 0.5,
    maxHeight: 0,
    shopItem: 1,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Burger Stall",
} as const

const sodaStall: RideTypeDescriptor = {
    description: "A refreshing soda stall that serves ice-cold drinks.",
    capacity: "N/A",
    flags: 0,
    rideType: RideType["SODA_STALL"],
    maxHeight: 0,
    shopItem: 1,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Soda Stall",
    excitementMultiplier: 0,
    intensityMultiplier: 0,
    nauseaMultiplier: 0
} as const

const atm: RideTypeDescriptor = {
    description: "Need some cash? This ATM has you covered.",
    capacity: "N/A",
    flags: 0,
    rideType: RideType["ATM"],
    excitementMultiplier: 0,
    intensityMultiplier: 0,
    nauseaMultiplier: 0,
    maxHeight: 0,
    shopItem: 1,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "ATM",
} as const

const informationKiosk: RideTypeDescriptor = {
    description: "Get information about the park and its attractions at this kiosk.",
    capacity: "N/A",
    flags: 0,
    rideType: RideType["INFORMATION_KIOSK"],
    excitementMultiplier: 0,
    intensityMultiplier: 0,
    nauseaMultiplier: 0,
    maxHeight: 0,
    shopItem: 1,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Information Kiosk",
} as const

const firstAid: RideTypeDescriptor = {
    description: "A first aid station for guests who need medical attention.",
    capacity: "N/A",
    flags: 0,
    rideType: RideType["FIRST_AID"],
    excitementMultiplier: 0,
    intensityMultiplier: 0,
    nauseaMultiplier: 0,
    maxHeight: 0,
    shopItem: 1,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "First Aid",
} as const

const balloonStall: RideTypeDescriptor = {
    description: "A colorful balloon stall that sells balloons of all shapes and sizes.",
    capacity: "N/A",
    flags: 0,
    rideType: RideType["BALLOON_STALL"],
    excitementMultiplier: 1.2,
    intensityMultiplier: 0.6,
    nauseaMultiplier: 0.3,
    maxHeight: 0,
    shopItem: 1,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Balloon Stall",
} as const;

const iceCreamStall: RideTypeDescriptor = {
    description: "A sweet ice cream stall that serves a variety of flavors.",
    capacity: "N/A",
    flags: 0,
    rideType: RideType["ICE_CREAM_STALL"],
    excitementMultiplier: 1.2,
    intensityMultiplier: 0.6,
    nauseaMultiplier: 0.3,
    maxHeight: 0,
    shopItem: 1,
    shopItemSecondary: 0,
    type: "ride",
    identifier: "",
    name: "Ice Cream Stall"
} as const;

const rideTypeDescriptors = [
    woodenCoaster,
    verticalCoaster,
    steelLoopingCoaster,
    steelMiniCoaster,
    suspendedSwingingCoaster,
    woodenWildMouseCoaster,
    gigaCoaster,
    invertedCoaster,
    logFlume,
    riverRapids,
    swingingInverterShip,
    mineTrainCoaster,
    bobsleighCoaster,
    scrambledEggs,
    swingingShip,
    hauntedHouse,
    merryGoRound,
    monorail,
    ferrisWheel,
    observationTower,
    enterprise,
    bathroom,
    burgerStall,
    sodaStall,
    atm,
    informationKiosk,
    firstAid,
    balloonStall,
    iceCreamStall,
] as const

/**
 * Returns the ride type descriptor for the given ride type ID or key.
 * @param id The ride type ID or key.
 * @returns The ride type descriptor, or undefined if not found.
 */
export const getRideTypeDescriptor = (id: number | keyof typeof RideType): RideTypeDescriptor => {
    return (rideTypeDescriptors.find((rideType) => rideType.rideType === (typeof id === "string" ? RideType[id] : id)) ?? rideTypeDescriptors[0])
}

export const getRideType = (id: keyof typeof RideType): number => {
    return RideType[id]
}

// Temporary until we have a proper ride creator
export const createRide = (props: { name: string, type: RideType, intensity: ModifierValue, excitement: ModifierValue, nausea: ModifierValue }): Ride => {
    const { name, type, intensity, excitement, nausea } = props

    const nauseaValue = calculateModifierValue(nausea, 100, 0);
    const intensityValue = calculateModifierValue(intensity, 100, 0);
    const excitementValue = calculateModifierValue(excitement, 100, 0);

    return {
        object: getRideTypeDescriptor(type),
        id: getNextRideId(),
        type,
        classification: getRideClassification(type),
        name,
        status: "closed",
        lifecycleFlags: 0,
        mode: 0,
        departFlags: 0,
        minimumWaitingTime: 0,
        maximumWaitingTime: 0,
        vehicles: [],
        vehicleColours: [],
        excitement: excitementValue,
        intensity: intensityValue,
        nausea: nauseaValue,
        colourSchemes: [],
        stationStyle: 0,
        music: 0,
        stations: [],
        price: [1.50],
        totalCustomers: 0,
        buildDate: getCurrentDate(),
        age: 0,
        runningCost: 0,
        totalProfit: 0,
        inspectionInterval: 0,
        value: 0,
        downtime: 0,
        liftHillSpeed: 0,
        maxLiftHillSpeed: 0,
        minLiftHillSpeed: 0
    }
}

const getCurrentDate = () => {
    // temporarily just return the tick
    return useStore.getState().tick
}

const getRideClassification = (ride: RideType): RideClassification => {
    // if the ride type is a stall, return stall; if facility, return facility, otherwise return ride
    switch (ride) {
        case RideType["BALLOON_STALL"]:
        case RideType["ICE_CREAM_STALL"]:
        case RideType["BURGER_STALL"]:
        case RideType["SODA_STALL"]:
            return "stall"
        case RideType["BATHROOM"]:
        case RideType["ATM"]:
        case RideType["INFORMATION_KIOSK"]:
        case RideType["FIRST_AID"]:
            return "facility"
        default:
            return "ride"
    }
}

const getBiggestRideId = (rides: Ride[]) => {
    return rides.reduce((biggestId, ride) => {
        return ride.id > biggestId ? ride.id : biggestId
    }, 0)
}

const getNextRideId = () => {
    const { rides } = useStore.getState();
    const lastRideId = getBiggestRideId(rides);
    for (let i = 0; i < lastRideId; i++) {
        if (!rides[i]) return i;
    }
    return rides.length;
}