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
import { createProductFamily } from "@/server/product/createProductFamily";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
    },
    mode: "all",
  });

  const [businesses, setBusinesses] = useState<{ id: string; name: string }[]>(
    [],
  );

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
