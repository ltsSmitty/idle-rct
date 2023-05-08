import { ActivityKeys, GuestActivityEffectState } from "../slices/activityEffectSlice";


export const getUpdatedGuestsAfterActivities = (guests: Guest[], activityEffectStats: GuestActivityEffectState): Guest[] => {
    return guests.map(guest => {
        const activityEffect = activityEffectStats[guest.currentActivity];
        return performGuestActivity(guest, activityEffect);
    });
}

// return a mutated guest with changed stats based on what the activity is
export const performGuestActivity = (guest: Guest, activityEffect: ActivityKeys): Guest => {
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