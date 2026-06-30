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
import { getBusinesses } from "@/server/business/getBusinesses";
import { createTaxRate } from "@/server/taxrate/createTaxRate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CreateTaxRateForm = () => {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<{ id: string; name: string }[]>(
    [],
  );

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CreateTaxRateInput>({
    resolver: zodResolver(createTaxRateSchema),
    defaultValues: {
      businessId: "",
      name: "",
      percent: "",
    },
    mode: "all",
  });

  useEffect(() => {
    const loadBusinesses = async () => {
      const nextBusinesses = await getBusinesses();
      setBusinesses(nextBusinesses);
    };

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
          name="businessId"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Business</FieldLabel>
              <select
                {...field}
                id={field.name}
                className="border-input bg-background focus-visible:border-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition outline-none">
                <option value="">Select business</option>
                {businesses.map((business) => (
                  <option
                    key={business.id}
                    value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
