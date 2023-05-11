import { calculateModifierValue } from "~/game/gameplay/generateGuests";
import { ActivityKeys, GuestActivityEffectState } from "../slices/activityEffectSlice";
import { useStore } from "../slices/allStateInOneWithoutActions";

const { activityChanceToUpdateStats } = useStore.getState();

export const getUpdatedGuestsAfterActivities = (guests: Guest[], activityEffectStats: GuestActivityEffectState): Guest[] => {

    const shouldGuestsUpdate = Math.random() < calculateModifierValue(activityChanceToUpdateStats, 1, 0);
    return guests.map(guest => {
        const activityEffect = activityEffectStats[guest.currentActivity];
        return shouldGuestsUpdate ? modifyGuestStatsByActivity(guest, activityEffect) : { ...guest };
    });
}

// return a mutated guest with changed stats based on what the activity is
export const modifyGuestStatsByActivity = (guest: Guest, activityEffect: ActivityKeys): Guest => {
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

// guest activity service ideas
/** take in a guest, return the guest mutated
 * * change guest stats based on activity effect
 * * change from negative guest activity once the effect is over
 * * choose which activity to do
 * * choose which ride/stall to go to
 * *
 *  */