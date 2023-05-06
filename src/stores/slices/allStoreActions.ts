import generateGuestsFromStats from "~/game/gameplay/generateGuests";
import { useStore } from "./allStateInOneWithoutActions";
import { Upgrade, type UpgradeKey } from "./upgradeSlice";
import { calculateGuestsToGenerate } from "~/game/helpers/helpers";

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

type GenerationStatKey = Exclude<UpgradeKey, "generationRate">

const acquireUpgrade = (upgrade: Upgrade) => useStore.setState((state => {
    const { guestGenerationStats, rate, upgrades, guests } = state
    const { generationRate, ...effects } = upgrade.effects

    // update the guest generation rate
    const upgradedRate = (rate + (generationRate?.value?.addend ?? 0)) * (generationRate?.value?.multiplier ?? 1)

    console.log(`upgraded rate: ${upgradedRate}`)

    // update the guest generation stat values.
    const upgradedGuestGenerationStats = { ...guestGenerationStats }
    Object.keys(effects).forEach(key => {
        const thisKey = effects[key as GenerationStatKey]
        if (!thisKey) { return }

        const stat = upgradedGuestGenerationStats[key as keyof typeof effects]

        stat.delta += thisKey.delta.addend
        stat.delta *= thisKey.delta.multiplier

        stat.value += thisKey.value.addend
        stat.value *= thisKey.value.multiplier
    })

    console.log(`upgraded guest generation stats: ${JSON.stringify(upgradedGuestGenerationStats)}`);

    // mark the upgrade as aquired
    const upgradedUpgrades = upgrades.map(u => {
        if (u.name === upgrade.name) {
            return { ...u, isAcquired: true }
        }
        return u
    })

    console.log(`upgraded upgrades: ${JSON.stringify(upgradedUpgrades)}`)

    // apply the upgrade to all current guests
    const upgradedGuests = [...guests]
    Object.keys(effects).forEach(key => {
        const thisKey = effects[key as GenerationStatKey]
        if (!thisKey) { return }

        guests.forEach(guest => {
            let originalModifierValue = guest[key as GenerationStatKey]

            if (typeof originalModifierValue === 'number') {

                originalModifierValue += thisKey.delta.addend
                originalModifierValue *= thisKey.delta.multiplier

                originalModifierValue += thisKey.value.addend
                originalModifierValue *= thisKey.value.multiplier
            }
        })
    })

    console.log(`upgraded guests: ${JSON.stringify(upgradedGuests)}`)

    return {
        guestGenerationStats: upgradedGuestGenerationStats,
        rate: upgradedRate,
        upgrades: upgradedUpgrades,
        guests: upgradedGuests
    }
}))


const actions = {
    doTick,
    acquireUpgrade
}

export default actions;