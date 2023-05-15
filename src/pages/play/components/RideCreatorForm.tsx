import {
  useCreateRideForm,
  RideCreatorFormProps,
} from "~/hooks/useCreateRideForm";
import { useStore } from "~/stores/slices/allStateInOneWithoutActions";

import { getRideTypeDescriptor } from "~/game/gameplay/rides";
import { Slider } from "~/components/ui/slider";
import { useState } from "react";
import { FormProvider, useFormContext } from "react-hook-form";

const defaultValues: RideCreatorFormProps = {
  name: "",
  type: "",
  nausea: 1,
  excitement: 1,
  intensity: 1,
};

export const CreateRideForm = () => {
  const { onSubmit, methods } = useCreateRideForm({ defaultValues });
  const rides = useStore((state) => state.rides);
  const rideTypes = useStore((state) => state.rideTypes);

  return (
    <div className="flex flex-col">
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <div className="">
            <label htmlFor="name">Ride name</label>
            <input
              {...methods.register("name", {
                required: "An ride name is required",
              })}
            />
          </div>
          <div className="">
            <label htmlFor="type">Ride type</label>
            <select
              {...methods.register("type", {
                required: "An ride type is required",
              })}
            >
              {rideTypes.map((rideType, i) => (
                <option key={i} value={getRideTypeDescriptor(rideType).name}>
                  {getRideTypeDescriptor(rideType).name}
                </option>
              ))}
            </select>
          </div>
          <ValueSlider
            label="excitement"
            stopLabels={["😴", "🫤", "🙂", "😄", "🤩"]}
            defaultValue={2}
            onSlide={(value) => {
              console.log("Excitement", value);
            }}
          />
          <ValueSlider
            label="intensity"
            stopLabels={["😑", "🫨", "😵"]}
            defaultValue={2}
            onSlide={(value) => {
              console.log("Intensity", value);
            }}
          />
          <ValueSlider
            label="nausea"
            stopLabels={["🙂", "🤢", "🤮"]}
            defaultValue={2}
            onSlide={(value) => {
              console.log("Nausea", value);
            }}
          />
          <button type="submit">Create ride</button>
          {methods.formState.errors && (
            <p>{methods.formState.errors.name?.message}</p>
          )}
          {methods.formState.errors && (
            <p>{methods.formState.errors.type?.message}</p>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

/**
 * A slider component that allows the user to select a value between 0 and the length of the stopLabels array.
 * @param label - The label for the slider.
 * @param stopLabels - An array of labels for each stop on the slider.
 * @param defaultValue - The default value of the slider.
 * @param onSlide - A function that is called when the slider is moved.
 * @returns A slider component.
 */
const ValueSlider = (props: {
  label: string;
  stopLabels: string[];
  defaultValue: number;
  onSlide: (value: number) => void;
}) => {
  const { label, stopLabels, defaultValue, onSlide } = props;
  const methods = useFormContext();
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex">
      <label htmlFor="name">{label}</label>
      <Slider
        {...methods.register(label)}
        className="mx-2 w-1/2 rounded-md"
        defaultValue={[defaultValue]}
        max={stopLabels.length - 1}
        min={0}
        step={1}
        onValueChange={(e) => {
          setValue(e[0] ?? 0);
          onSlide(e[0] ?? 0);
          methods.setValue(label, e[0] ?? 0);
        }}
      />
      <label htmlFor={label}>
        {stopLabels[value] ?? stopLabels[0] ?? "🤷‍♂️"}
      </label>
    </div>
  );
};
