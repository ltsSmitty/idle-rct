import { create } from "zustand";
import { GuestGenerationState, initialGuestGenerationState } from "./guestGenerationSlice";
import { GuestGenerationRateState, initialGuestGenerationRateState } from "./guestGenerationRateSlice";
import {
    GuestGenerationStatsState, initialGuestGenerationStateValues
} from "./guestGenerationStatsSlice";
import { GuestState, initialGuestState } from "./guestSlice";
import { GameState, initialGameState } from "./gameSlice";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { UpgradeState, initialUpgradeState } from "./upgradeSlice";
import { MoneyState, initialMoneyState } from "./moneySlice";
import { type GuestActivityEffectState, initialGuestActivityEffectState } from "./activityEffectSlice";
import { ActivityDurationState, initialActivityDurationState } from "./activityDurationSlice";
import { ActivityChanceToSwitchState, initialActivityChanceToSwitchState } from "./activityChanceToSwitchSlice";
import { ActivityChanceToUpdateState, initialActivityChanceToUpdateState } from "./activityChanceToUpdate";
import { RideState, initialRideState } from "./rideSlice";
import { RideQueueState, initialRideQueueState } from "./rideQueueSlice";


type StoreState = GuestGenerationState &
    GuestGenerationRateState &
// don't want to pollute the store with too many individual values, so keeping these stats non-destructured
{ guestGenerationStats: GuestGenerationStatsState } &
    GuestState &
    GameState &
    UpgradeState &
    MoneyState &
{ activityEffectStats: GuestActivityEffectState } &
{ activityDurationStats: ActivityDurationState } &
{ activityChanceToSwitchActivitiesStats: ActivityChanceToSwitchState } &
{ activityChanceToUpdateStats: ActivityChanceToUpdateState } &
    RideState &
{ rideQueueState: RideQueueState };

export const useStore = create<StoreState>()(immer(devtools(() => ({
    ...initialGuestGenerationState,
    ...initialGuestGenerationRateState,
    // don't want to pollute the store with too many individual values, so keeping these stats non-destructured
    guestGenerationStats: initialGuestGenerationStateValues,
    ...initialGuestState,
    ...initialGameState,
    ...initialUpgradeState,
    ...initialMoneyState,
    activityEffectStats: initialGuestActivityEffectState,
    activityDurationStats: initialActivityDurationState,
    activityChanceToSwitchActivitiesStats: initialActivityChanceToSwitchState,
    activityChanceToUpdateStats: initialActivityChanceToUpdateState,
    ...initialRideState,
    rideQueueState: initialRideQueueState
}))));
