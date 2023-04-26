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

test(`GuestController can doTick`, () => {
    const uc = new UpgradeController();
    const gc = new GuestController({ upgradeController: uc });
    console.log(`Guests at init: ${gc.guests.length}`)
    gc.doTick();
    console.log(`Guests after tick ${gc.ticks}: ${gc.guests.length}`)
    expect(gc.guests.length).toBe(2);
})

test('UpgradeController can add an upgrade', () => {
    const uc = new UpgradeController();
    const gc = new GuestController({ upgradeController: uc });
    console.log(`testUpgrade effects: ${JSON.stringify(testUpgrade.effects)}`)
    uc.addUpgrade(testUpgrade);
    expect(uc.upgrades.length).toBe(1);

    // do tick 10 times
    for (let i = 0; i < 10; i++) {
        gc.doTick();
    }
    console.log(`Guests after tick ${gc.ticks}: ${gc.guests.length}`)

    expect(gc.guests.length).toBe(30);
})


