import { calculateModifierValue } from "~/game/gameplay/generateGuests";
import { ActivityKeys, GuestActivityEffectState } from "../slices/activityEffectSlice";
import { useStore } from "../slices/allStateInOneWithoutActions";


export const getUpdatedGuestsAfterActivities = (guests: Guest[], activityEffectStats: GuestActivityEffectState): Guest[] => {
    return guests.map(guest => {
        const activityEffect = activityEffectStats[guest.currentActivity];
        return shouldGuestsUpdate() ? modifyGuestStatsByActivity(guest, activityEffect) : { ...guest };
    });
}

/**
 * Modifies the stats of a guest based on the effect of their current activity.
 * @param {Guest} guest - The guest whose stats will be modified.
 * @param {ActivityKeys} activityEffect - The effect of the guest's current activity on their stats.
 * @returns {Guest} - The guest with modified stats.
 */
export const modifyGuestStatsByActivity = (guest: Guest, activityEffect: ActivityKeys): Guest => {
    // Create a new object with the same properties as the original guest object, but with modified stat values.
    const mutatedGuest: Guest = {
        ...guest,
        happiness: guest.happiness + activityEffect.happiness,
        energy: guest.energy + activityEffect.energy,
        hunger: guest.hunger + activityEffect.hunger,
        thirst: guest.thirst + activityEffect.thirst,
        toilet: guest.toilet + activityEffect.toilet,
        nausea: guest.nausea + activityEffect.nausea
    };

    return mutatedGuest;
}

const { activityChanceToUpdateStats } = useStore.getState();

/**
 * Determines whether guests should have their stats updated based on a random chance.
 * @returns {boolean} - True if guests should be updated, false otherwise.
 */
const shouldGuestsUpdate = (): boolean => {
    // The chance of guests being updated is determined by the activityChanceToUpdateStats value.
    // The calculateModifierValue function returns a value between 0 and 1 based on this chance.
    // If the returned value is less than a random number between 0 and 1, guests should be updated.
    return Math.random() < calculateModifierValue(activityChanceToUpdateStats, 1, 0);
}


// guest activity service ideas
/** take in a guest, return the guest mutated
 * * change guest stats based on activity effect
 * * change from negative guest activity once the effect is over
 * * choose which activity to do
 * * choose which ride/stall to go to
 * *
 *  */