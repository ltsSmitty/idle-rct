import { Upgrade } from "~/stores/slices/upgradeSlice";

export const exampleUpgrades: Upgrade[] = [
    {
        name: 'Basic Advertising',
        description: 'Get a small boost in interest for your park.',
        cost: 10,
        effects: {
            generationRate: {
                value: {
                    multiplier: 1.1,
                    addend: 0
                },
                delta: {
                    multiplier: 1,
                    addend: 0
                }
            }
        },
        isAcquired: false
    },
    {
        name: 'Fancy Advertising',
        description: 'Get a medium boost in interest for your park.',
        cost: 100,
        effects: {
            generationRate: {
                value: {
                    multiplier: 1.2,
                    addend: 0
                },
                delta: {
                    multiplier: 1,
                    addend: 0
                }
            }
        },
        isAcquired: false
    }
]