"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { changeEmail } from "@/server/user/changeEmail";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const changeEmailSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;

const ChangeEmailForm = ({ currentEmail }: { currentEmail: string }) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      email: currentEmail,
    },
    mode: "all",
  });

  const onSubmit = async (values: ChangeEmailFormValues) => {
    const result = await changeEmail(values);

    if (result.success) {
      toast.success("Email updated successfully");
      return;
    }

    toast.error(result.error ?? "Failed to update email");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4">
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                autoComplete="email"
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
            Updating email...
          </>
        : "Save email"}
      </Button>
    </form>
  );
};

export default ChangeEmailForm;
