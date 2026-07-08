import { zodResolver } from "@hookform/resolvers/zod";

import {
  useForm,
  type FieldValues,
  type DefaultValues,
  type SubmitHandler,
  type UseFormProps,
} from "react-hook-form";

import RenderInputField, { type FieldConfig } from "./RenderInputField";
import FieldWrapper from "./FieldWrapper";
import SubmitButton, { type SubmitButtonProps } from "./SubmitButton";
import type { SuccessfulResponse } from "@/types/axios";
import type { AxiosResponse } from "axios";
import type { ZodType } from "zod";
import displayError from "@/lib/displayError";

export type FormCol = "full" | "half" | "third" | "fourth";

export type FormProps<T extends FieldValues, R> = {
  inputs: FieldConfig<T>[];
  schema?: ZodType<T, T>;
  defaultValues?: DefaultValues<T>;
  submitButton?: SubmitButtonProps;
  service?: (data: T) => Promise<AxiosResponse<SuccessfulResponse<R>>>;
  onSuccess?: (data: SuccessfulResponse<R> | T) => void;
};

export default function Form<T extends FieldValues, R>({
  inputs,
  schema,
  defaultValues,
  submitButton,
  service,
  onSuccess,
}: FormProps<T, R>) {
  const initUseForm: UseFormProps<T> = {
    ...(defaultValues && { defaultValues }),
    ...(schema && { resolver: zodResolver(schema) }),
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<T>(initUseForm);

  const onSubmit: SubmitHandler<T> = async (data) => {
    try {
      if (service) {
        const response = await service(data);
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        if (onSuccess) {
          onSuccess(data);
        }
      }
    } catch (error) {
      displayError({ error, mes: "حدث خطأ غير متوقع" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 grid-cols-12">
        {inputs.map((input) => (
          <FieldWrapper
            key={String(input.name)}
            htmlFor={String(input.name)}
            error={errors[input.name]?.message as string | undefined}
            label={input.label}
            col={input.col}
          >
            <RenderInputField
              config={input}
              control={control}
              register={register}
            />
          </FieldWrapper>
        ))}
      </div>
      {submitButton && (
        <SubmitButton isSubmitting={isSubmitting} {...submitButton} />
      )}
    </form>
  );
}
