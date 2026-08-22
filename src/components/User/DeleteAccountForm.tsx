"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { DeleteAccountFormValues, deleteAccountSchema } from "@/lib/zodSchema";
import { deleteAccount } from "@/server/user/deleteAccount";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const DeleteAccountForm = () => {
  const [showPassword, setShowPassword] = useState(false);
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
              <div className="relative">
                <Input
                  {...field}
                  id="deletePassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={
                    "text-muted-foreground hover:text-foreground absolute top-2.5 right-3.5"
                  }
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}>
                  {showPassword ?
                    <EyeOffIcon className="size-4" />
                  : <EyeIcon className="size-4" />}
                </button>
              </div>
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
