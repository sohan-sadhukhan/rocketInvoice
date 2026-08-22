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
  ChangePasswordFormValues,
  changePasswordSchema,
} from "@/lib/zodSchema";
import { changePassword } from "@/server/user/changePassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ChangePasswordForm = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    mode: "all",
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    const result = await changePassword(values);

    if (result.success) {
      reset();
      toast.success("Password updated successfully");
      return;
    }

    toast.error(result.error ?? "Failed to update password");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4">
      <FieldGroup>
        <Controller
          name="currentPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="currentPassword">
                Current password
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your current password"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className={
                    "text-muted-foreground hover:text-foreground absolute top-2.5 right-3.5"
                  }
                  aria-label={
                    showCurrentPassword ? "Hide password" : "Show password"
                  }
                  aria-pressed={showCurrentPassword}>
                  {showCurrentPassword ?
                    <EyeOffIcon className="size-4" />
                  : <EyeIcon className="size-4" />}
                </button>
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="newPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="newPassword">New password</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className={
                    "text-muted-foreground hover:text-foreground absolute top-2.5 right-3.5"
                  }
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                  aria-pressed={showNewPassword}>
                  {showNewPassword ?
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
        disabled={isSubmitting}>
        {isSubmitting ?
          <>
            <Loader2Icon className="animate-spin" />
            Updating password...
          </>
        : "Update password"}
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
