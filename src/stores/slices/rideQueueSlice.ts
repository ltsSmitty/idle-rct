
type RideQueueActivity = Extract<(keyof typeof GuestActivity), "WAITING_IN_LINE" | "WALKING_TO_RIDE_ENTRANCE" | "RIDING_RIDE" | "WALKING_TO_RIDE_EXIT">

export type RideGuestQueue = Record<RideQueueActivity, Guest[]>

export type RideQueueState = {
    [rideId: number]: RideGuestQueue
}

export const initialRideQueueState: RideQueueState = {}