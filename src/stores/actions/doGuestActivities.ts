import { canActivityBeInterrupted, getNextGuestActivity, guestHasAdverseImpacts, hasGuestFixedProblemState } from "~/game/gameplay/getNextGuestActivity";
import { useStore } from "../slices/allStateInOneWithoutActions";
import { calculateModifierValue } from "~/game/gameplay/generateGuests";

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
    const updatedGuests = guests.map(guest => {

        // check if ticks til next activity is 0
        if (guest.ticksTilActivityChange <= 0 || hasGuestFixedProblemState(guest)) {
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
    guest.currentActivity = getNextGuestActivity(guest).activity;
    // randomly choose a length, with an absolute max of 100 ticks
    guest.ticksTilActivityChange = calculateModifierValue(activityDurationStats, 100, 0);
    return guest;
}

/**
 * Determines whether a guest should be interrupted from their current activity based on the chance to switch activities.
 * @returns A boolean indicating whether the guest should be interrupted.
 */
const shouldGuestBeInterrupted = (): boolean => {
    const chanceToSwitch = calculateModifierValue(activityChanceToSwitchActivitiesStats, 1, 0);
    return Math.random() < chanceToSwitch;
}
