// MVP to see what needs to happen to advance a tick and generate guests
// needs ticks
// needs all the guest generation stats
// needs guest generation rate
// needs the guest generator

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


type StoreState = GuestGenerationState &
    GuestGenerationRateState &
{ guestGenerationStats: GuestGenerationStatsState } &
    GuestState &
    GameState &
    UpgradeState &
    MoneyState

export const useStore = create<StoreState>()(immer(devtools(() => ({
    ...initialGuestGenerationState,
    ...initialGuestGenerationRateState,
    // don't want to pollute the store with too many individual values, so keeping these stats non-destructured
    guestGenerationStats: initialGuestGenerationStateValues,
    ...initialGuestState,
    ...initialGameState,
    ...initialUpgradeState,
    ...initialMoneyState
}))));