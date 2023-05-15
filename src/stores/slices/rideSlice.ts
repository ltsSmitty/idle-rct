import { RideType } from "~/game/gameplay/rides/ride"

export interface RideState {
    rides: Ride[],
    /** The list of unlocked rides, stalls and facilites. */
    rideTypes: RideType[]
}

export const initialRideState: RideState = {
    rides: [],
    rideTypes: [
        RideType.BATHROOM,
        RideType.ICE_CREAM_STALL,
        RideType.INFORMATION_KIOSK,
        RideType.BALLOON_STALL,
        RideType.FERRIS_WHEEL,
        RideType.MERRY_GO_ROUND,
        RideType.WOODEN_COASTER,
        RideType.STEEL_MINI_COASTER
    ]
}