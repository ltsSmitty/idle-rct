/** Every time a guest finishes an activity chain, they have the option to roll to go on a ride.
 * If they ride to go on a ride, then the handler will choose what ride they should go on based on their nausea and intensity preferences.
 * Once a ride has been selected, the guest will start walking toward that ride. A distance service will be used to determine how long it will take them to get there.
 * Once they arrive, the guest's activity progress will delegated to that ride. The ride will
 * * pass them back if the queue is full
 * * pass them back if the ride is closed/broken
 * * add them to its internal queue
 * * move rides through line > entering ride > riding ride > exiting ride
 * * pass back guests after they exit the ride
 */

import { useStore } from "~/stores/slices/allStateInOneWithoutActions";

/**
 * Calculates the distance between a guest's current location and a given destination using the Pythagorean theorem.
 * @param guest - The guest whose location is being compared to the destination.
 * @param destinationCoords - The coordinates of the destination.
 * @returns The time in ticks that it will take for the guest to reach the destination based on their speed.
 */
const distanceCalculationService = ({ guest, destinationCoords }: { guest: Guest, destinationCoords: CoordsXYZ }) => {
    // at some point in the future potentially do something more complex here, but for now just do the pythagorean theorem
    const distance = Math.sqrt(
        Math.pow(guest.location.x - destinationCoords.x, 2) +
        Math.pow(guest.location.y - destinationCoords.y, 2) +
        Math.pow(guest.location.z - destinationCoords.z, 2)
    )

    // is guest speed something I want to implement?
    // const GUEST_SPEED: number = guest.speed ?? 1
    const GUEST_SPEED = 1

    return { ticksToArrive: distance / GUEST_SPEED };
}

// const guestRideQueueHandler = ({ guest, ride }: { guest: Guest, ride: Ride }) => {
//     // upon arrival, guest has just finished walking to the ride
//     // start with a check if the guest can get in line - cannot if the ride's queue is full, or its closed/testing/broken down
// }

const { rides, rideQueueState } = useStore.getState();
export const guestRideQueueHandler = ({ guest }: { guest: Guest }): Guest => {

    /** A guest being passed here means they rolled to walk to a ride, or that they're somewhere in the ride queueing process. First check if they have just rolled  */

    // guest has been assigned to ride a ride but not the specific ride yet,
    if (guest.currentActivity === "WALKING_TO_RIDE" && guest.destinationRideId == undefined) {
        // choose a ride for them based on the rides that exist. if they won't ride any of the rides that exist, return with destinationRideId undefined and re-handle it in the doGuestActivities
        const destinationRideId = chooseRideForGuest({ guest })
        if (destinationRideId == undefined) {
            console.log(`No ride found for guest ${guest.id} to ride`);
        }
    }
}

const chooseRideForGuest = ({ guest }: { guest: Guest }): number | undefined => {
    // choose a ride for them based on the rides that exist. if they won't ride any of the rides that exist, return with destinationRideId undefined and re-handle it in the doGuestActivities
    const ridesThatGuestWillRide = rides.filter(ride => guestWillRideRide({ guest, ride }))
    if (ridesThatGuestWillRide.length === 0) {
        return undefined
    }
    else {
        // sort the rides in order of excitement
        const sortedRides = ridesThatGuestWillRide.sort((a, b) => a.excitement - b.excitement)

        // choose a ride that's a combination of close and exciting
        // todo factor in distance to the ride
        return sortedRides[0]?.id
    }
}

const guestWillRideRide = ({ guest, ride }: { guest: Guest, ride: Ride }): boolean => {
    // check if the guest will ride the ride based on their nausea and intensity preferences
    return (
        guest.nauseaToleranceRange.upperBound >= ride.nausea &&
        guest.nauseaToleranceRange.lowerBound <= ride.nausea &&
        guest.intensityPreferenceRange.upperBound >= ride.intensity &&
        guest.intensityPreferenceRange.lowerBound <= ride.intensity
    )
}