"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { signUpSchema, type SignUpInput } from "@/lib/zodSchema";
import { signUp } from "@/server/user/signUp";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const onSubmit = async (values: SignUpInput) => {
    const result = await signUp(values);

    if (result.success) {
      toast.success("Account created successfully");
      router.push("/dashboard" as never);
      return;
    }

    toast.error(result.error ?? "Failed to create account");
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
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
                placeholder="Your name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                placeholder="you@example.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Create a password"
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

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className={
                    "text-muted-foreground hover:text-foreground absolute top-2.5 right-3.5"
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  aria-pressed={showConfirmPassword}>
                  {showConfirmPassword ?
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
        className="w-full"
        disabled={isSubmitting}>
        {isSubmitting ?
          <>
            <Loader2Icon className="animate-spin" />
            Creating account...
          </>
        : "Sign up"}
      </Button>
    </form>
  );
};

export default SignUpForm;
