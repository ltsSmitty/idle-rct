import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { addRide, createRideFromForm } from "~/stores/actions/addRide";

export type RideCreatorFormProps = {
  name: string;
  type: number;
  nausea: number;
  excitement: number;
  intensity: number;
};

export const useCreateRideForm = ({
  defaultValues,
}: {
  defaultValues?: RideCreatorFormProps;
}) => {
  const methods = useForm<RideCreatorFormProps>({
    defaultValues,
  });
  const onSubmit = useCallback((formValues: RideCreatorFormProps) => {
    console.log(formValues);
    const ride = createRideFromForm(formValues);
    addRide(ride);
  }, []);

  return {
    methods,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};
