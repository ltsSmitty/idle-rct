import generateGuestsFromStats from "~/game/gameplay/generateGuests";
import { useStore } from "./allStateInOneWithoutActions";

const doTick = () => useStore.setState((state => {
    const { rate, guestGenerationStats, tick, nextGuestId, guestGenerationLocation, guests } = state;

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
        guests: [...guests, ...newGuests],
        nextGuestId: newNextGuestId
    }
}
))


const calculateGuestsToGenerate = (rate: number) => {
    // doing 1 - Math.random so that we get 1 included in the range
    return Math.floor(rate * (1 - Math.random()) * 10);
}

export default doTick;