"use client";

import { Field, FieldLabel } from "@/components/shadcnui/field";
import getAllBusiness from "@/server/business/getAllBusiness";
import { getCurrentBusiness } from "@/server/business/getCurrentBusiness";
import { updateCurrentBusiness } from "@/server/business/updateCurrentBusiness";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Business = {
  id: string;
  name: string;
};

const BusinessSwitcher = () => {
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[] | null>([]);

  useEffect(() => {
    const load = async () => {
      const [businesses, currentBusinessId] = await Promise.all([
        getAllBusiness(),
        getCurrentBusiness(),
      ]);

      const currentBusiness = businesses?.find(
        (data: any) => data.id === currentBusinessId?.currentBusinessId,
      );

      if (currentBusiness) {
        setSelectedBusinessId(currentBusiness.id);
      }

      setBusinesses(businesses);
    };

    void load();
  }, []);

  const handleSubmit = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const businessId = event.target.value;
    setSelectedBusinessId(businessId);

    if (!businessId) {
      toast.error("Select a business to make it active.");
      return;
    }

    setIsLoading(true);
    const result = await updateCurrentBusiness(businessId);
    setIsLoading(false);

    if (result.success) {
      setSelectedBusinessId(result.data ?? "");
      toast.success("Current business updated.");
      return;
    }

    toast.error(result.error ?? "Failed to update current business.");
  };

  return (
    <form className="space-y-4">
      <Field>
        <FieldLabel htmlFor="business-switcher-select">
          Current Business
        </FieldLabel>
        <select
          id="business-switcher-select"
          value={selectedBusinessId}
          onChange={handleSubmit}
          className="border-input bg-background focus-visible:border-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition outline-none">
          {businesses &&
            businesses.map((business) => (
              <option
                key={business.id}
                value={business.id}>
                {isLoading ? "Saving..." : business.name}
              </option>
            ))}
        </select>
      </Field>
    </form>
  );
};

export default BusinessSwitcher;
