import { calculateGuestsToGenerate } from "~/game/helpers/helpers";
import { useStore } from "../slices/allStateInOneWithoutActions";
import generateGuestsFromStats from "~/game/gameplay/generateGuests";
import { getUpdatedGuestsAfterActivities } from "./performGuestActivity";

export const doTick = () => useStore.setState((state => {
    const { rate, guestGenerationStats, tick, nextGuestId, guestGenerationLocation, guests, activityEffectStats } = state;

    // perform the activities for existing guests
    const updatedGuests = getUpdatedGuestsAfterActivities(guests, activityEffectStats);

    // grab the number of guests to create
    const numGuestsToGenerate = calculateGuestsToGenerate(rate);
    console.log(`Tick ${tick} generated ${numGuestsToGenerate} guests`)

    // generate the guests
    const { newGuests, nextGuestId: newNextGuestId } = generateGuestsFromStats({
        guestStats: guestGenerationStats,
        guestGenerationLocation,
        firstNextGuestId: nextGuestId,
        numberOfGuestsToGenerate: numGuestsToGenerate
    });
    return {
        tick: tick + 1,
        guests: [...updatedGuests, ...newGuests],
        nextGuestId: newNextGuestId
    }
}
))