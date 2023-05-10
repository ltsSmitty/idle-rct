import { calculateModifierValue } from "~/game/gameplay/generateGuests";
import { ActivityKeys, GuestActivity, GuestActivityEffectState } from "../slices/activityEffectSlice";
import { useStore } from "../slices/allStateInOneWithoutActions";

const { activityChanceToUpdateStats } = useStore.getState();

export const getUpdatedGuestsAfterActivities = (guests: Guest[], activityEffectStats: GuestActivityEffectState): Guest[] => {

    const shouldGuestsUpdate = Math.random() < calculateModifierValue(activityChanceToUpdateStats, 1, 0);
    console.log(`activityEffectStats`, activityEffectStats)
    return guests.map(guest => {

        console.log(`activityEffectStats[guest.currentActivity]`, activityEffectStats[guest.currentActivity])

        const activityEffect = activityEffectStats[guest.currentActivity];
        console.log(`guest.currentActivity`, guest.currentActivity)
        console.log(`activityEffect`, activityEffect)

        return shouldGuestsUpdate ? performGuestActivity(guest, activityEffect) : { ...guest };
    });
}

// return a mutated guest with changed stats based on what the activity is
export const performGuestActivity = (guest: Guest, activityEffect: ActivityKeys): Guest => {

    console.log("performing activity", activityEffect);

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


const getActivityKey = (activity: GuestActivity): string => {
    return Object.keys(GuestActivity).find(key => GuestActivity[key as keyof typeof GuestActivity] === activity) || "";
}
