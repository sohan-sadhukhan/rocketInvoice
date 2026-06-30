"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import {
  createProductFamilySchema,
  type CreateProductFamilyInput,
} from "@/lib/zodSchema";
import { getBusinesses } from "@/server/business/getBusinesses";
import { createProductFamily } from "@/server/product/createProductFamily";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CreateProductFamilyForm = () => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CreateProductFamilyInput>({
    resolver: zodResolver(createProductFamilySchema),
    defaultValues: {
      name: "",
      businessId: "",
    },
    mode: "all",
  });

  const [businesses, setBusinesses] = useState<{ id: string; name: string }[]>(
    [],
  );

  useEffect(() => {
    const load = async () => {
      const items = await getBusinesses();
      setBusinesses(items.map((b: any) => ({ id: b.id, name: b.name })));
    };

    void load();
  }, []);

  const onSubmit = async (values: CreateProductFamilyInput) => {
    const result = await createProductFamily(values);

    if (result.success) {
      toast.success("Product family created successfully");
      router.push("/products/create" as never);
      return;
    }

    toast.error(result.error ?? "Failed to create product family");
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
                <option value="">Select a business</option>
                {businesses.map((b) => (
                  <option
                    key={b.id}
                    value={b.id}>
                    {b.name}
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
              <FieldLabel htmlFor={field.name}>Family</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Electronics"
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
            Creating family...
          </>
        : "Create family"}
      </Button>
    </form>
  );
};

export default CreateProductFamilyForm;
