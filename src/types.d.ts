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

type BoundedProperty = {
    lowerBound: number;
    upperBound: number;
}
type GuestActivityKey = keyof typeof GuestActivity

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

    currentActivity: GuestActivityKey;
    nextActivity: GuestActivityKey | null;
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

type ObjectType =
    "ride" |
    "small_scenery" |
    "large_scenery" |
    "wall" |
    "banner" |
    "footpath" |
    "footpath_addition" |
    "scenery_group" |
    "park_entrance" |
    "water" |
    "terrain_surface" |
    "terrain_edge" |
    "station" |
    "music" |
    "footpath_surface" |
    "footpath_railings";

/**
 * Represents the definition of a loaded object (.DAT or .json) such a ride type or scenery item.
 */
interface LoadedObject {
    /**
     * The object type.
     */
    readonly type: ObjectType;

    /**
     * The index of the loaded object for the object type.
     */
    // readonly index: number;

    /**
     * The unique identifier of the object, e.g. "rct2.burgb".
     * Only JSON objects will have an identifier.
     */
    readonly identifier: string;

    /**
     * The name in the user's current language.
     */
    readonly name: string;
}
/**
 * Represents the object definition of a ride or stall.
 */
interface RideObject extends LoadedObject {
    /**
     * The description of the ride / stall in the player's current language.
     */
    readonly description: string;
    /**
     * A text description describing the capacity of the ride in the player's current language.
     */
    readonly capacity: string;

    readonly flags: number;
    readonly rideType: number;
    // readonly minCarsInTrain: number;
    // readonly maxCarsInTrain: number;
    // readonly carsPerFlatRide: number;
    // readonly zeroCars: number;
    // readonly tabVehicle: number;
    // readonly defaultVehicle: number;
    // readonly frontVehicle: number;
    // readonly secondVehicle: number;
    // readonly rearVehicle: number;
    // readonly thirdVehicle: number;
    // readonly vehicles: RideObjectVehicle[];
    readonly excitementMultiplier: number;
    readonly intensityMultiplier: number;
    readonly nauseaMultiplier: number;
    readonly maxHeight: number;
    readonly shopItem: number;
    readonly shopItemSecondary: number;
}

/**
 * Represents a defined vehicle within a Ride object definition.
 */
interface RideObjectVehicle {
    readonly rotationFrameMask: number;
    readonly spacing: number;
    readonly carMass: number;
    readonly tabHeight: number;
    readonly numSeats: number;
    readonly spriteFlags: number;
    readonly spriteWidth: number;
    readonly spriteHeightNegative: number;
    readonly spriteHeightPositive: number;
    readonly animation: number;
    readonly flags: number;
    readonly baseNumFrames: number;
    readonly baseImageId: number;
    // readonly spriteGroups: SpriteGroups;
    readonly noVehicleImages: number;
    readonly noSeatingRows: number;
    readonly spinningInertia: number;
    readonly spinningFriction: number;
    readonly frictionSoundId: number;
    readonly logFlumeReverserVehicleType: number;
    readonly soundRange: number;
    readonly doubleSoundFrequency: number;
    readonly poweredAcceleration: number;
    readonly poweredMaxSpeed: number;
    readonly carVisual: number;
    readonly effectVisual: number;
    readonly drawOrder: number;
    readonly numVerticalFramesOverride: number;
}

/**
    * Represents a ride or stall within the park.
    */
interface Ride {
    /**
     * The object metadata for this ride.
     */
    readonly object: RideObject;

    /**
     * The unique ID / index of the ride.
     */
    readonly id: number;

    /**
     * The type of the ride represented as the internal built-in ride type ID.
     */
    type: number;

    /**
     * Whether the ride is a ride, shop or facility.
     */
    readonly classification: RideClassification;

    /**
     * The generated or custom name of the ride.
     */
    name: string;

    /**
     * Whether the ride is open, closed or testing.
     */
    readonly status: RideStatus;

    /**
     * Various flags related to the operation of the ride.
     */
    lifecycleFlags: number;

    /**
     * The operation mode.
     */
    mode: number;

    /**
     * Flags related to how trains depart.
     */
    departFlags: number;

    /**
     * The minimum time a train will wait at the station before departing.
     */
    minimumWaitingTime: number;

    /**
     * The maximum time a train will wait at the station before departing.
     */
    maximumWaitingTime: number;

    /**
     * The head vehicle IDs associated with the ride, one for each train.
     */
    readonly vehicles: number[];

    /**
     * The colour for each vehicle when the ride opens. Modifying this directly will not
     * change the colour of any currently running trains nor will it reflect them if they
     * have been modified.
     */
    vehicleColours: VehicleColour[];

    /**
     * The track colour schemes for the ride.
     */
    colourSchemes: TrackColour[];

    /**
     * The style used for the station, entrance, and exit building.
     */
    stationStyle: number;

    /**
     * The music track to play at each station.
     */
    music: number;

    /**
     * Information about each station.
     */
    readonly stations: RideStation[];

    /**
     * The admission price for the ride and the price of the on-ride photo, or the cost of each item of the stall.
     */
    price: number[];

    /**
     * The excitement metric of the ride represented as a 2 decimal point fixed integer.
     * For example, `652` equates to `6.52`.
     */
    excitement: number;

    /**
     * The intensity metric of the ride represented as a 2 decimal point fixed integer.
     * For example, `652` equates to `6.52`.
     */
    intensity: number;

    /**
     * The nausea metric of the ride represented as a 2 decimal point fixed integer.
     * For example, `652` equates to `6.52`.
     */
    nausea: number;

    /**
     * The total number of customers the ride has served since it was built.
     */
    totalCustomers: number;

    /**
     * The date in months when the ride was built.
     * Subtract this from `date.monthsElapsed` to get the age.
     */
    buildDate: number;

    /**
     * How old the ride is in months.
     */
    readonly age: number;

    /**
     * The running cost of the ride billed every fortnight. Multiply this by 16 to get the cost per hour (~ 1 year).
     */
    runningCost: number;

    /**
     * The total profit of the ride over the course of its lifetime.
     */
    totalProfit: number;

    /**
     * How often the ride should be inspected by a mechanic.
     */
    inspectionInterval: number;

    /**
     * The value of the ride.
     */
    value: number;

    /**
     * The percentage of downtime for this ride from 0 to 100.
     */
    readonly downtime: number;

    /**
     * The currently set chain lift speed in miles per hour.
     */
    liftHillSpeed: number;

    /**
     * The max chain lift speed for this ride in miles per hour.
     */
    readonly maxLiftHillSpeed: number;

    /**
     * The min chain lift speed for this ride in miles per hour.
     */
    readonly minLiftHillSpeed: number;
}

type RideClassification = "ride" | "stall" | "facility";

type RideStatus = "closed" | "open" | "testing" | "simulating";

interface TrackColour {
    main: number;
    additional: number;
    supports: number;
}

interface VehicleColour {
    body: number;
    trim: number;
    tertiary: number;
}

interface RideStation {
    start: CoordsXYZ;
    length: number;
    entrance: CoordsXYZD;
    exit: CoordsXYZD;
}

/**
 * A coordinate within the game.
 * Each in-game tile is a size of 32x32.
 */
interface CoordsXY {
    x: number;
    y: number;
}

/**
 * A coordinate within the game.
 * Each in-game tile is a size of 32x32.
 * The z-coordinate raises 16 per land increment. A full-height wall is 32 in height.
 */
interface CoordsXYZ extends CoordsXY {
    z: number;
}

/**
 * A coordinate within the game.
 * Each in-game tile is a size of 32x32.
 * The z-coordinate raises 16 per land increment. A full-height wall is 32 in height.
 * The direction is between 0 and 3.
 */
interface CoordsXYZD extends CoordsXYZ {
    direction: Direction;
}

type Direction = 0 | 1 | 2 | 3;