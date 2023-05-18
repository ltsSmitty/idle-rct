import { RideCreatorFormProps } from "~/hooks/useCreateRideForm";
import { useStore } from "../slices/allStateInOneWithoutActions";
import { RideType, createRide } from "~/game/gameplay/rides";
import { ModifierValue } from "~/game/gameplay/guest";

export const addRide = (ride: Ride) => useStore.setState((state) => {
    const { rides } = state;

    return {
        rides: [...rides, ride],
    };
});

export const removeRide = (ride: Ride) => useStore.setState((state) => {
    const { rides } = state;

    return {
        rides: rides.filter((r) => r.id !== ride.id),
    };
});

export const createRideFromForm = (ride: RideCreatorFormProps): Ride => {

    //translate nausea, intensity, and excitement from 0-4 scale to 0-15 scale
    // change the ride type to something acceptable
    const nausea = convertFormScaleToValues(ride.nausea as FormScale)
    const intensity = convertFormScaleToValues(ride.intensity as FormScale)
    const excitement = convertFormScaleToValues(ride.excitement as FormScale)


    const newRide = createRide({
        name: validateNewRideName(ride.name),
        type: ride.type,
        nausea: nausea,
        intensity: intensity,
        excitement: excitement,
    });
    return newRide;
}

type FormScale = 0 | 1 | 2 | 3 | 4

const convertFormScaleToValues = (input: FormScale): ModifierValue => {

    const d = 1.28
    const delta = d - 0.01

    switch (input) {
        // value = low
        case 0:
            return { value: d, delta }
        // value = medium
        case 1:
            return { value: 3 * d, delta }
        // value = high
        case 2:
            return { value: 5 * d, delta }
        // value = very high
        case 3:
            return { value: 7 * d, delta }
        // value = extreme
        case 4:
            return { value: 9 * d, delta }
        default:
            throw new Error(`Invalid numerical input for ride form: ${Number(input)}, must be 0-4`)
    }
}

export const validateNewRideName = (name: string) => {
    const rides = useStore.getState().rides;
    const nameExists = (rides.map((r) => r.name).some((n) => n === name))
    if (!nameExists) {
        return name;
    }
    const ridesWithSameName = rides.filter((r) => r.name.slice(0, name.length) === name)
        .map(r => r.name)
    const lastNumber = ridesWithSameName.map((n) => Number(n.slice(name.length)))
        .sort((a, b) => b - a)[0]

    return `${name} ${(lastNumber ?? 0) + 1}`
}
