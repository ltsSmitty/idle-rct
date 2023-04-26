/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type GuestGenerator, type GuestGenerationKey, type ModifierValue } from "./guest";



/** The multiplicative and additive stats of an upgrade */
export type UpgradeEffect = {
    /** The multiplicative effect of the upgrade */
    multiplier: number

    /** The additive effect of the upgrade */
    addend: number
}

type UpgradeKey = keyof GuestGenerationKey | 'generationRate'

/** All the effects of the upgrade */
type AllUpgradeEffects = {
    [key in UpgradeKey]?: {
        [modifierKey in keyof ModifierValue]: UpgradeEffect
    }
}

interface IUpgrade {
    name: string
    description: string
    cost: number
    effects: AllUpgradeEffects
    specialEffects: unknown
    active: boolean
    applyUpgradeToGuestGenerator(guestGenerator: GuestGenerator): void
    applyUpgradeToGuests(guests: Guest[]): void
}

// need to handle creating new guests, updating existing guests, and removing guests
// while updating guests, need to see if they're done with their current activity and move them to the next one

//for the guest generator, need to handle the following:
// - the rate of guest creation
// - generate a guest
// - generate a group of guests
// - generate a group of guests with a specific activity


export class Upgrade implements IUpgrade {
    name = 'Base Upgrade'
    description = 'This is the base upgrade'
    cost = 0
    effects: AllUpgradeEffects = {};
    specialEffects: unknown = {};
    active = false;

    constructor(props?: Partial<Upgrade>) {
        Object.assign(this, props)
    }

    applyUpgradeToGuestGenerator(guestGenerator: GuestGenerator): void {

        const { generationRate, ...effects } = this.effects

        // handle the guest generation first
        guestGenerator.upgradeGuestGenerationRate(generationRate?.value);

        // handle all the stats for the newly generated guests
        const { guestBuilder } = guestGenerator
        Object.keys(effects).forEach(key => { // we've already handled generationRate, so we can skip it here
            const thisKey = this.effects[key as UpgradeKey]
            if (!thisKey) { return }

            const originalModifierValue = guestBuilder.getModifiers()[key as keyof typeof effects]

            originalModifierValue.delta += thisKey.delta.addend
            originalModifierValue.delta *= thisKey.delta.multiplier

            originalModifierValue.value += thisKey.value.addend
            originalModifierValue.value *= thisKey.value.multiplier
        })
    }

    applyUpgradeToGuests(guests: Guest[]): void {
        Object.keys(this.effects).forEach(key => {
            const thisKey = this.effects[key as UpgradeKey]
            if (!thisKey) { return }

            guests.forEach(guest => {
                let originalModifierValue = guest[key as Exclude<UpgradeKey, "generationRate">]

                if (typeof originalModifierValue === 'number') {

                    originalModifierValue += thisKey.delta.addend
                    originalModifierValue *= thisKey.delta.multiplier

                    originalModifierValue += thisKey.value.addend
                    originalModifierValue *= thisKey.value.multiplier
                }
            })
        })
    }
}


export class UpgradeController {
    private _upgrades: Upgrade[] = []
    private numUpgradesLastTick = 0;

    /** Applies upgrades to the provided GuestBuilder or Guest[] by mutating the provided objects. Skips over upgrades which have already been marked as active so as not to double-apply them*/
    applyUpgrades(props: { guestGenerator?: GuestGenerator, guests?: Guest[] }): void {
        const { guestGenerator, guests } = props
        this.upgrades.forEach(upgrade => {

            if (upgrade.active) return // don't reapply an upgrade again
            if (guestGenerator) {
                upgrade.applyUpgradeToGuestGenerator(guestGenerator)
                upgrade.active = true // mark the upgrade as active so we don't reapply it
            }
            if (guests) {
                upgrade.applyUpgradeToGuests(guests);
                upgrade.active = true
            }
        })
    }

    addUpgrade(upgrade: Upgrade): void {
        this._upgrades.push(upgrade)
    }

    removeUpgrade(upgrade: Upgrade): void {
        this._upgrades = this.upgrades.filter(u => u !== upgrade)
    }

    // sum up all the effects from all the upgrades
    getCombinedUpgradeValues(): AllUpgradeEffects {
        return this.upgrades.reduce((acc, upgrade) => {
            Object.keys(upgrade.effects).forEach(key => {
                const thisKey = upgrade.effects[key as UpgradeKey]
                if (!thisKey) { return }

                if (!acc[key as UpgradeKey]) {
                    acc[key as UpgradeKey] = {
                        delta: {
                            addend: 0,
                            multiplier: 1,
                        },
                        value: {
                            addend: 0,
                            multiplier: 1,
                        },
                    }
                }

                acc[key as UpgradeKey]!.delta.addend += thisKey.delta.addend
                acc[key as UpgradeKey]!.delta.multiplier *= thisKey.delta.multiplier

                acc[key as UpgradeKey]!.value.addend += thisKey.value.addend
                acc[key as UpgradeKey]!.value.multiplier *= thisKey.value.multiplier
            })
            return acc
        }, {} as AllUpgradeEffects)
    }

    get upgrades(): Upgrade[] {
        return this._upgrades
    }

    private set upgrades(upgrades: Upgrade[]) {
        this._upgrades = upgrades
    }


}