import { type GuestGenerationKey, type ModifierValue } from "~/game/gameplay/guest"
import { exampleUpgrades } from "~/game/gameplay/upgrades"

/** The multiplicative and additive stats of an upgrade */
type UpgradeEffect = {
    /** The multiplicative effect of the upgrade */
    multiplier: number

    /** The additive effect of the upgrade */
    addend: number
}

export type UpgradeKey = keyof GuestGenerationKey | 'generationRate'

/** All the effects of the upgrade */
type AllUpgradeEffects = {
    [key in UpgradeKey]?: {
        [modifierKey in keyof ModifierValue]: UpgradeEffect
    }
}

export interface Upgrade {
    name: string
    description: string
    cost: number
    effects: AllUpgradeEffects
    specialEffects?: unknown
    isAcquired: boolean
}

export interface UpgradeState {
    upgrades: Upgrade[]
}

export const initialUpgradeState: UpgradeState = {
    upgrades: exampleUpgrades
}
