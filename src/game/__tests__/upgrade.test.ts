import { Upgrade, UpgradeController } from "../gameplay/upgrade";
import { GuestController } from "../gameplay/guest";
import '@testing-library/jest-dom'

const testUpgrade = new Upgrade();

testUpgrade.name = "Test Upgrade";
testUpgrade.description = "This is a test upgrade";
testUpgrade.cost = 100;
testUpgrade.effects = {
    generationRate: {
        delta: {
            addend: 1,
            multiplier: 1,
        },
        value: {
            addend: 1,
            multiplier: 1,
        },
    },
}


const uc = new UpgradeController();

const gc = new GuestController({ upgradeController: uc });

test(`GuestController can doTick`, () => {
    console.log(`Guests at init: ${gc.guests.length}`)
    gc.doTick();
    console.log(`Guests after tick ${gc.ticks}: ${gc.guests.length}`)
    expect(gc.guests.length).toBe(2);
})

test('UpgradeController can add an upgrade', () => {
    console.log(`testUpgrade effects: ${JSON.stringify(testUpgrade.effects)}`)
    uc.addUpgrade(testUpgrade);
    expect(uc.upgrades.length).toBe(1);
})

test('Test Upgrade will increase guest generation rate', () => {
    const upgrade2 = new Upgrade({
        name: "Test Upgrade 2",
        description: "This is a test upgrade 2",
        cost: 100,
        effects: {
            generationRate: {
                delta: {
                    addend: 1,
                    multiplier: 1,
                },
                value: {
                    addend: 1,
                    multiplier: 1,
                },
            },
        },
    })
    uc.addUpgrade(upgrade2);
    expect(uc.upgrades.length).toBe(2);
    console.log(`All upgrade effects: ${JSON.stringify(uc.getCombinedUpgradeValues())}`)
    gc.doTick();


    // do tick 10 times
    for (let i = 0; i < 10; i++) {
        gc.doTick();
        console.log(`Guests after tick ${gc.ticks}: ${gc.guests.length}`)
    }
    console.log(JSON.stringify(gc.guests, null, 2))
})


