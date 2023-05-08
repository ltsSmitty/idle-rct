import { calculateGuestsToGenerate } from "~/game/helpers/helpers";
import { useStore } from "../slices/allStateInOneWithoutActions";
import generateGuestsFromStats from "~/game/gameplay/generateGuests";
import { getUpdatedGuestsAfterActivities } from "./performGuestActivity";
import { doGuestActivites } from "./doGuestActivities";

export const doTick = () => useStore.setState((state => {
    const { rate, guestGenerationStats, tick, nextGuestId, guestGenerationLocation, guests, activityEffectStats } = state;

    // perform the activities for existing guests
    const updatedGuests = getUpdatedGuestsAfterActivities(guests, activityEffectStats);

    // update guests activities
    const updatedGuestsAfterActivities = doGuestActivites({ guests: updatedGuests });

    // grab the number of guests to create
    const numGuestsToGenerate = calculateGuestsToGenerate(rate);
    console.log(`Tick ${tick} generated ${numGuestsToGenerate} guests`)

    // generate the guests
    const { newGuests, nextGuestId: newNextGuestId } = generateGuestsFromStats({
        guestStats: guestGenerationStats,
        guestGenerationLocation,
        firstNextGuestId: nextGuestId,
        numberOfGuestsToGenerate: (guests.length < 20 ? numGuestsToGenerate : 0)
    });
    return {
        tick: tick + 1,
        guests: [...updatedGuestsAfterActivities, ...newGuests],
        nextGuestId: newNextGuestId
    }
}
))