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
    // const ONE_PERCENT = 1 - Number(Math.random().toFixed(2))
    const generatedValue = (rate * (1 - Number(Math.random().toFixed(2))));
    console.log(`Generated value: ${generatedValue}`)
    return Math.floor(generatedValue)
}

export default doTick;