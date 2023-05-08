import { useStore } from "../slices/allStateInOneWithoutActions"
import { UpgradeKey, Upgrade } from "../slices/upgradeSlice"

type GenerationStatKey = Exclude<UpgradeKey, "generationRate">

export const acquireUpgrade = (upgrade: Upgrade) => useStore.setState((state => {
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

    // mark the upgrade as aquired
    const upgradedUpgrades = upgrades.map(u => {
        if (u.name === upgrade.name) {
            return { ...u, isAcquired: true }
        }
        return u
    })

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