import { canActivityBeInterrupted, getNextGuestActivity, guestHasAdverseImpacts, hasGuestFixedProblemState } from "~/game/gameplay/getNextGuestActivity";
import { useStore } from "../slices/allStateInOneWithoutActions";
import { calculateModifierValue } from "~/game/gameplay/generateGuests";
import { GuestActivity } from "../slices/activityEffectSlice";
import { guestRideQueueHandler } from "~/game/gameplay/guestRideQueueHandler";

const { activityDurationStats, activityChanceToSwitchActivitiesStats } = useStore.getState();


/**
 * This function performs activities for each guest in the provided array of guests.
 * It checks if the guest's ticks til next activity is 0, and if so, it assigns a new activity to the guest.
 * If the guest cannot be interrupted in their current activity, it decreases the ticks til next activity by 1 and returns the guest.
 * If the guest can be interrupted and has a negative modifier, it has a random chance of interrupting them and assigning a new activity.
 * If the guest is not interrupted, it decreases the ticks til next activity by 1 and returns the guest.
 * @param guests An array of guests to perform activities for.
 * @returns An array of updated guests after performing activities.
 */
export const doGuestActivites = ({ guests }: { guests: Guest[] }): Guest[] => {
    const updatedGuests = guests.map(function processGuestActivity(guest) {

        // check if ticks til next activity is 0
        if (guest.ticksTilActivityChange <= 0 || hasGuestFixedProblemState(guest)) {
            // if (guest.ticksTilActivityChange <= 0) {
            return assignNewActivity(guest);
        }

        // check if the guest can be interrupted in what they're already doing
        if (!canActivityBeInterrupted(guest.currentActivity)) {
            guest.ticksTilActivityChange -= 1;
            return guest;
        }

        // handle interrupting the guest
        // have a random % chance of interrupting them if they have a negative modifier
        if (guestHasAdverseImpacts(guest)) {
            if (shouldGuestBeInterrupted()) {
                return assignNewActivity(guest);
            }
        }

        // if not interrupted, decrease a tick and continue
        guest.ticksTilActivityChange -= 1;
        return guest;
    })
    return updatedGuests;
}


/** Set a guest's new activity and number of ticks til next activity */
const assignNewActivity = (guest: Guest): Guest => {
    guest.destinationRideId = undefined;
    guest.currentActivity = getNextGuestActivity({ guest }).activity;

    if (shouldGuestBeHandledByRideQueue(guest)) {
        // handle everything else with the ride queue handler
        const guestWithRide = guestRideQueueHandler({ guest })
        /**  this guest with ride needs to come back with a rideDestinationId. if it doesn't,
         * then there wasn't a valid ride, so we need to get a new activity for the guest,
         * this time excluding ride options        */
        if (guestWithRide.destinationRideId !== null) return guestWithRide;

        //there was an issues with getting a ride, so we need to get a new activity for the guest, this time excluding ride options
        const rideActivitiesToExclude: GuestActivityKey[] = [
            "WAITING_IN_LINE",
            "WALKING_TO_RIDE",
            "WALKING_TO_RIDE_ENTRANCE",
            "RIDING_RIDE",
            "WALKING_TO_RIDE_EXIT"];

        guestWithRide.currentActivity = getNextGuestActivity({ guest, exclude: rideActivitiesToExclude }).activity;

        // randomly choose a length, with an absolute max of 100 ticks
        guest.ticksTilActivityChange = calculateModifierValue(activityDurationStats[guest.currentActivity], 100, 0);
        return guest;
    }
}

/**
 * Determines whether a guest should be interrupted from their current activity based on the chance to switch activities.
 * @returns A boolean indicating whether the guest should be interrupted.
 */
const shouldGuestBeInterrupted = (): boolean => {
    const chanceToSwitch = calculateModifierValue(activityChanceToSwitchActivitiesStats, 1, 0);
    return Math.random() < chanceToSwitch;
}

/**
 * Determines whether a guest should be handled by the ride queue handler based on their current activity.
 * Guests that are walking to a ride, waiting in line, riding a ride, or walking to a ride entrance or exit should be handled by the ride queue handler.
 * @param guest The guest to check.
 * @returns A boolean indicating whether the guest should be handled by the ride queue handler.
 */
const shouldGuestBeHandledByRideQueue = (guest: Guest): boolean => {
    return (
        guest.currentActivity === "WALKING_TO_RIDE" ||
        guest.currentActivity === "WAITING_IN_LINE" ||
        guest.currentActivity === "RIDING_RIDE" ||
        guest.currentActivity === "WALKING_TO_RIDE_ENTRANCE" ||
        guest.currentActivity === "WALKING_TO_RIDE_EXIT"
    )
}