"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import { createProductSchema, type CreateProductInput } from "@/lib/zodSchema";
import { createProduct } from "@/server/product/createProduct";
import { getAllProductFamilies } from "@/server/product/getAllProductFamilies";
import { getAllTaxRates } from "@/server/taxrate/getAllTaxRates";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcnui/select";

const CreateProduct = () => {
  const router = useRouter();
  const [families, setFamilies] = useState<{ id: string; name: string }[]>([]);
  const [taxRates, setTaxRates] = useState<
    { id: string; name: string; percent: string }[]
  >([]);
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      taxRateId: "",
      price: "",
      familyId: "",
    },
    mode: "all",
  });

  useEffect(() => {
    const loadData = async () => {
      const [nextFamilies, nextTaxRates] = await Promise.all([
        getAllProductFamilies(),
        getAllTaxRates(),
      ]);

      setFamilies(nextFamilies);
      setTaxRates(nextTaxRates);
    };

    void loadData();
  }, []);

  const onSubmit = async (values: CreateProductInput) => {
    const result = await createProduct(values);

    if (result.success) {
      toast.success("Product created successfully");
      router.push("/products" as never);
      return;
    }

    toast.error(result.error ?? "Failed to create product");
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
              <FieldLabel htmlFor={field.name}>Product name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Product name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Product description</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Optional product description"
                rows={3}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="taxRateId"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tax rate</FieldLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Tax Rate" />
                </SelectTrigger>
                <SelectContent>
                  {taxRates.map((taxRate) => (
                    <SelectItem
                      key={taxRate.id}
                      value={taxRate.id}>
                      {taxRate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <select
                {...field}
                id={field.name}
                className="border-input bg-background focus-visible:border-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition outline-none">
                <option value="">Select a tax rate</option>
                {taxRates.map((taxRate) => (
                  <option
                    key={taxRate.id}
                    value={taxRate.id}>
                    {taxRate.name} ({taxRate.percent}%)
                  </option>
                ))}
              </select> */}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Price</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                inputMode="decimal"
                aria-invalid={fieldState.invalid}
                placeholder="999.00"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="familyId"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Family</FieldLabel>

              <Select
                value={field.value != null ? String(field.value) : ""}
                onValueChange={field.onChange}>
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Select a family" />
                </SelectTrigger>
                <SelectContent>
                  {families.map((family) => (
                    <SelectItem
                      key={family.id}
                      value={String(family.id)}>
                      {family.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            Creating product...
          </>
        : "Create product"}
      </Button>
    </form>
  );
};

export default CreateProduct;
