import { useCallback } from "react";
import { useForm } from "react-hook-form";

type ValueOption = "low" | "medium" | "high" | "very high" | "extreme";

export type RideCreatorFormProps = {
  name: string;
  type: string;
  nausea: number;
  excitement: number;
  intensity: number;
};

export const useCreateRideForm = (props?: {
  defaultValues: RideCreatorFormProps;
}) => {
  const defaultValues = props?.defaultValues;
  const methods = useForm<RideCreatorFormProps>({
    defaultValues,
  });
  const onSubmit = useCallback((formValues: RideCreatorFormProps) => {
    // todo actually handle the form submission
    console.log(formValues);
  }, []);

  return {
    methods,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};
