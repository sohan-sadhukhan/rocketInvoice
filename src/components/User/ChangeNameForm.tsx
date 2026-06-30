"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { changeName } from "@/server/user/changeName";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const changeNameSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

type ChangeNameFormValues = z.infer<typeof changeNameSchema>;

const ChangeNameForm = ({ currentName }: { currentName: string }) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ChangeNameFormValues>({
    resolver: zodResolver(changeNameSchema),
    defaultValues: {
      name: currentName,
    },
    mode: "all",
  });

  const onSubmit = async (values: ChangeNameFormValues) => {
    const result = await changeName(values);

    if (result.success) {
      toast.success("Name updated successfully");
      return;
    }

    toast.error(result.error ?? "Failed to update name");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4">
      <FieldGroup>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        disabled={isSubmitting}>
        {isSubmitting ?
          <>
            <Loader2Icon className="animate-spin" />
            Updating name...
          </>
        : "Save name"}
      </Button>
    </form>
  );
};

export default ChangeNameForm;
