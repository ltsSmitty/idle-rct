import { useStore } from "../slices/allStateInOneWithoutActions";
import { GuestActivityEffectState, ActivityKeys, GuestActivityKey } from "../slices/activityEffectSlice";
/**
 * Sets the value of a given activity effect in the store.
 * @param activity The key of the activity effect to update.
 * @param value The new value to set for the activity effect.
 */

export const setActivityEffectValue = ({ activity, value }: { activity: GuestActivityKey, value: ActivityKeys }) => useStore.setState((state => {
    const { activityEffectStats } = state;
    const updatedActivityEffectStats: GuestActivityEffectState = {
        ...activityEffectStats,
        [activity]: value
    }

    return {
        activityEffectStats: updatedActivityEffectStats
    }
}));