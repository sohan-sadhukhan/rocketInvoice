"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { deleteAccount } from "@/server/user/deleteAccount";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const deleteAccountSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
});

type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

const DeleteAccountForm = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
    },
    mode: "all",
  });

  const onSubmit = async (values: DeleteAccountFormValues) => {
    const result = await deleteAccount(values);

    if (result.success) {
      reset();
      toast.success("Account deleted successfully");
      return;
    }

    toast.error(result.error ?? "Failed to delete account");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4">
      <FieldGroup>
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="deletePassword">Password</FieldLabel>
              <Input
                {...field}
                id="deletePassword"
                type="password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        variant="destructive"
        disabled={isSubmitting}>
        {isSubmitting ?
          <>
            <Loader2Icon className="animate-spin" />
            Deleting account...
          </>
        : "Delete account"}
      </Button>
    </form>
  );
};

export default DeleteAccountForm;
