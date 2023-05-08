import { GuestActivity } from "~/stores/slices/activityEffectSlice";
import generateGuestsFromStats from "../gameplay/generateGuests"
import { useStore } from "~/stores/slices/allStateInOneWithoutActions"
import { getNextGuestActivity } from "~/stores/slices/nextActivityState"


test(`guest can change activity`, () => {
    const { guestGenerationStats, guestGenerationLocation, nextGuestId } = useStore.getState();
    const guests = generateGuestsFromStats({ guestStats: guestGenerationStats, guestGenerationLocation, firstNextGuestId: nextGuestId, numberOfGuestsToGenerate: 2 })

    const activityHistory: GuestActivity[] = [];
    activityHistory.push(guests.newGuests[0]?.currentActivity ?? GuestActivity["GONE"])

    console.log("initial activities:", guests.newGuests.map(g => g.currentActivity))

    for (let i = 0; i < 50; i++) {
        activityHistory.push(getNextGuestActivity(guests.newGuests[0] ?? {} as Guest).activity)
    }

    console.log(`50 activities: ${JSON.stringify(activityHistory, null, 2)}`)
})