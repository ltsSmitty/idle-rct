import { getNextGuestActivity } from './../gameplay/getNextGuestActivity';
import { GuestActivity } from "~/stores/slices/activityEffectSlice";
import generateGuestsFromStats from "../gameplay/generateGuests"
import { useStore } from "~/stores/slices/allStateInOneWithoutActions"



test(`guest can change activity`, () => {
    const { guestGenerationStats, guestGenerationLocation, nextGuestId } = useStore.getState();
    // guestGenerationStats.nausea = { value: 10, delta: 0 };
    const guests = generateGuestsFromStats({ guestStats: { ...guestGenerationStats, }, guestGenerationLocation, firstNextGuestId: nextGuestId, numberOfGuestsToGenerate: 1 })

    const activityHistory: GuestActivity[] = [];
    activityHistory.push(guests.newGuests[0]?.currentActivity ?? GuestActivity["GONE"])

    console.log("initial activities:", guests.newGuests.map(g => g.currentActivity))

    for (let i = 0; i < 50; i++) {
        const nextGuestActivity = getNextGuestActivity(guests.newGuests[0] ?? {} as Guest).activity
        guests.newGuests[0] ? guests.newGuests[0].currentActivity = nextGuestActivity : null;
        activityHistory.push(nextGuestActivity)
    }

    console.log(`10 activities: ${JSON.stringify(activityHistory, null, 2)}`)
})