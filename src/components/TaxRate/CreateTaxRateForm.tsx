"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { createTaxRateSchema, type CreateTaxRateInput } from "@/lib/zodSchema";
import { createTaxRate } from "@/server/taxrate/createTaxRate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CreateTaxRateForm = () => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CreateTaxRateInput>({
    resolver: zodResolver(createTaxRateSchema),
    defaultValues: {
      name: "",
      percent: "",
    },
    mode: "all",
  });

  useEffect(() => {
    const loadBusinesses = async () => {};

    void loadBusinesses();
  }, []);

  const onSubmit = async (values: CreateTaxRateInput) => {
    const result = await createTaxRate(values);

    if (result.success) {
      toast.success("Tax rate created successfully");
      router.push("/taxrate" as never);
      return;
    }

    toast.error(result.error ?? "Failed to create tax rate");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6">
      <FieldGroup>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tax rate name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Standard VAT"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="percent"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tax rate percent</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                inputMode="decimal"
                aria-invalid={fieldState.invalid}
                placeholder="18"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}>
        {isSubmitting ?
          <>
            <Loader2Icon className="animate-spin" />
            Creating tax rate...
          </>
        : "Create tax rate"}
      </Button>
    </form>
  );
};

export default CreateTaxRateForm;
