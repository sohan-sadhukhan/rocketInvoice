"use client";

import { Button } from "@/components/shadcnui/button";
import { Card } from "@/components/shadcnui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import { createInvoiceSchema, type CreateInvoiceInput } from "@/lib/zodSchema";
import { getBusinesses } from "@/server/business/getBusinesses";
import { getClients } from "@/server/client/getClients";
import { createInvoice } from "@/server/invoice/createInvoice";
import { getProducts } from "@/server/product/getProducts";
import { getTaxRates } from "@/server/taxrate/getTaxRates";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const today = new Date().toISOString().split("T")[0];

const formatAmount = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const CreateInvoiceForm = () => {
  const router = useRouter();

  const [businesses, setBusinesses] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [clients, setClients] = useState<
    {
      id: string;
      name: string;
      address: string;
      contactInformation: string;
    }[]
  >([]);
  const [products, setProducts] = useState<
    {
      id: string;
      name: string;
      price: string;
      taxRate: string;
    }[]
  >([]);
  const [taxRates, setTaxRates] = useState<
    {
      id: string;
      name: string;
      percent: string;
    }[]
  >([]);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<CreateInvoiceInput>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      businessId: "",
      invoiceDate: today,
      status: "draft",
      paymentMethod: "cash",
      clientId: "",
      clientName: "",
      clientAddress: "",
      clientContactInformation: "",
      items: [
        {
          productId: "",
          name: "",
          quantity: "1",
          price: "0.00",
          discount: "0.00",
          taxRate: "0",
        },
      ],
      globalDiscount: "0.00",
    },
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    const load = async () => {
      const [businessItems, clientItems, productItems, taxRateItems] =
        await Promise.all([
          getBusinesses(),
          getClients(),
          getProducts(),
          getTaxRates(),
        ]);

      setBusinesses(businessItems);
      setClients(
        clientItems.map((client) => ({
          id: client.id,
          name: client.name,
          address: client.address,
          contactInformation: client.contactInformation,
        })),
      );
      setProducts(
        productItems.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          taxRate: product.taxRate,
        })),
      );
      setTaxRates(taxRateItems);
    };

    void load();
  }, []);

  const watchedItems = watch("items");
  const watchedClientId = watch("clientId");
  const watchedGlobalDiscount = watch("globalDiscount");

  useEffect(() => {
    const selectedClient = clients.find(
      (client) => client.id === watchedClientId,
    );

    if (!selectedClient) {
      return;
    }

    setValue("clientName", selectedClient.name);
    setValue("clientAddress", selectedClient.address);
    setValue("clientContactInformation", selectedClient.contactInformation);
  }, [clients, setValue, watchedClientId]);

  const totals = useMemo(() => {
    const subtotal = watchedItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      return sum + quantity * price;
    }, 0);

    const itemDiscount = watchedItems.reduce((sum, item) => {
      return sum + (Number(item.discount) || 0);
    }, 0);

    const taxTotal = watchedItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const taxRate = Number(item.taxRate) || 0;
      return sum + quantity * price * (taxRate / 100);
    }, 0);

    const globalDiscount = Number(watchedGlobalDiscount) || 0;
    const total = subtotal - itemDiscount + taxTotal - globalDiscount;

    return {
      subtotal,
      itemDiscount,
      taxTotal,
      total,
    };
  }, [watchedGlobalDiscount, watchedItems]);

  const onSubmit = async (values: CreateInvoiceInput) => {
    const result = await createInvoice(values);

    if (result.success) {
      toast.success("Invoice created successfully");
      router.push("/invoices" as never);
      return;
    }

    toast.error(result.error ?? "Failed to create invoice");
  };

  const addItem = () =>
    append({
      productId: "",
      name: "",
      quantity: "1",
      price: "0.00",
      discount: "0.00",
      taxRate: "0",
    });

  const computeLineTotal = (item: CreateInvoiceInput["items"][number]) => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const taxRate = Number(item.taxRate) || 0;
    return quantity * price - discount + quantity * price * (taxRate / 100);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <FieldGroup>
          <Controller
            name="businessId"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="invoice-business-select">
                  Business
                </FieldLabel>
                <select
                  {...field}
                  id="invoice-business-select"
                  className="border-input bg-background focus-visible:border-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition outline-none">
                  <option value="">Select business</option>
                  {businesses.map((business) => (
                    <option
                      key={business.id}
                      value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="invoiceDate"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="invoice-date-input">
                  Invoice date
                </FieldLabel>
                <Input
                  {...field}
                  id="invoice-date-input"
                  type="date"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="invoice-status-select">Status</FieldLabel>
                <select
                  {...field}
                  id="invoice-status-select"
                  className="border-input bg-background focus-visible:border-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition outline-none">
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="paymentMethod"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="invoice-payment-method-select">
                  Payment method
                </FieldLabel>
                <select
                  {...field}
                  id="invoice-payment-method-select"
                  className="border-input bg-background focus-visible:border-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition outline-none">
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                </select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="clientId"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="invoice-client-select">
                  Existing client
                </FieldLabel>
                <select
                  {...field}
                  id="invoice-client-select"
                  className="border-input bg-background focus-visible:border-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition outline-none">
                  <option value="">Manual client entry</option>
                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="clientName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="client-name-input">Client name</FieldLabel>
                <Input
                  {...field}
                  id="client-name-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="Client name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="clientAddress"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="client-address-input">
                  Client address
                </FieldLabel>
                <Textarea
                  {...field}
                  id="client-address-input"
                  aria-invalid={fieldState.invalid}
                  rows={3}
                  placeholder="Client address"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="clientContactInformation"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="client-contact-input">
                  Contact information
                </FieldLabel>
                <Input
                  {...field}
                  id="client-contact-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="Email or phone"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold">
              Invoice items
            </h2>
            <p className="text-muted-foreground">
              Add products or services and let the totals update automatically.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={addItem}>
            <PlusIcon /> Add item
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((fieldItem, index) => {
            const item = watchedItems[index] ?? fieldItem;
            const lineTotal = computeLineTotal(item);

            return (
              <div
                key={fieldItem.id}
                className="border-border grid gap-4 rounded-3xl border p-4 shadow-sm sm:grid-cols-12">
                <div className="sm:col-span-2">
                  <Controller
                    name={`items.${index}.productId` as const}
                    control={control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor={`product-select-${index}`}>
                          Product
                        </FieldLabel>
                        <select
                          {...field}
                          id={`product-select-${index}`}
                          className="border-input bg-background focus-visible:border-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition outline-none"
                          onChange={(event) => {
                            const productId = event.target.value;
                            field.onChange(productId);

                            const selectedProduct = products.find(
                              (product) => product.id === productId,
                            );

                            if (!selectedProduct) {
                              return;
                            }

                            setValue(
                              `items.${index}.name`,
                              selectedProduct.name,
                            );
                            setValue(
                              `items.${index}.price`,
                              selectedProduct.price,
                            );
                            setValue(
                              `items.${index}.taxRate`,
                              selectedProduct.taxRate,
                            );
                          }}>
                          <option value="">Manual item</option>
                          {products.map((product) => (
                            <option
                              key={product.id}
                              value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </Field>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Controller
                    name={`items.${index}.name` as const}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`item-name-${index}`}>
                          Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`item-name-${index}`}
                          aria-invalid={fieldState.invalid}
                          placeholder="Item description"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Controller
                    name={`items.${index}.quantity` as const}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`item-quantity-${index}`}>
                          Qty
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`item-quantity-${index}`}
                          type="number"
                          inputMode="decimal"
                          min={1}
                          aria-invalid={fieldState.invalid}
                          placeholder="1"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Controller
                    name={`items.${index}.price` as const}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`item-price-${index}`}>
                          Price
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`item-price-${index}`}
                          type="text"
                          inputMode="decimal"
                          aria-invalid={fieldState.invalid}
                          placeholder="0.00"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Controller
                    name={`items.${index}.discount` as const}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`item-discount-${index}`}>
                          Discount
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`item-discount-${index}`}
                          type="text"
                          inputMode="decimal"
                          aria-invalid={fieldState.invalid}
                          placeholder="0.00"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Controller
                    name={`items.${index}.taxRate` as const}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`item-tax-rate-${index}`}>
                          Tax rate
                        </FieldLabel>
                        <select
                          {...field}
                          id={`item-tax-rate-${index}`}
                          className="border-input bg-background focus-visible:border-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition outline-none">
                          <option value="">Select tax rate</option>
                          {taxRates.map((taxRate) => (
                            <option
                              key={taxRate.id}
                              value={taxRate.percent}>
                              {taxRate.name} ({taxRate.percent}%)
                            </option>
                          ))}
                        </select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="flex flex-col justify-between gap-3 sm:col-span-2">
                  <div>
                    <p className="text-muted-foreground text-sm">Line total</p>
                    <p className="text-lg font-semibold">
                      {formatAmount(lineTotal)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}>
                    <Trash2Icon /> Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(280px,360px)]">
        <Card className="border-border bg-background rounded-3xl border">
          <div className="p-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="font-heading text-lg font-semibold">Totals</h2>
                <p className="text-muted-foreground">
                  Review the invoice totals before submitting.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="bg-muted flex items-center justify-between rounded-2xl px-4 py-3">
                  <span className="text-muted-foreground text-sm">
                    Subtotal
                  </span>
                  <span className="font-medium">
                    {formatAmount(totals.subtotal)}
                  </span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-2xl px-4 py-3">
                  <span className="text-muted-foreground text-sm">
                    Item discount
                  </span>
                  <span className="font-medium">
                    -{formatAmount(totals.itemDiscount)}
                  </span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-2xl px-4 py-3">
                  <span className="text-muted-foreground text-sm">Tax</span>
                  <span className="font-medium">
                    {formatAmount(totals.taxTotal)}
                  </span>
                </div>

                <Controller
                  name="globalDiscount"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="global-discount-input">
                        Global discount
                      </FieldLabel>
                      <Input
                        {...field}
                        id="global-discount-input"
                        type="text"
                        inputMode="decimal"
                        aria-invalid={fieldState.invalid}
                        placeholder="0.00"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-background rounded-3xl border">
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">Grand total</p>
              <p className="text-2xl font-semibold">
                {formatAmount(totals.total)}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}>
              {isSubmitting ?
                <>
                  <Loader2Icon className="animate-spin" /> Create invoice...
                </>
              : "Create invoice"}
            </Button>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default CreateInvoiceForm;
