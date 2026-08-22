"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { signInSchema, type SignInInput } from "@/lib/zodSchema";
import { signIn } from "@/server/user/signIn";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmit = async (values: SignInInput) => {
    const result = await signIn(values);

    if (result.success) {
      toast.success("Signed in successfully");
      router.push("/dashboard" as never);
      return;
    }

    toast.error(result.error ?? "Failed to sign in");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6">
      <FieldGroup>
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
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}

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
            Signing in...
          </>
        : "Sign in"}
      </Button>
    </form>
  );
};

export default SignInForm;
