import { useStore } from "../slices/allStateInOneWithoutActions";

export const addRide = (ride: Ride) => useStore.setState((state) => {
    const { rides } = state;

    return {
        rides: [...rides, ride],
    };
});